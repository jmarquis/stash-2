import "./NotePane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Editor, EditorState, convertFromRaw, getDefaultKeyBinding, KeyBindingUtil } from "draft-js"
const { hasCommandModifier } = KeyBindingUtil
import autobind from "autobind-decorator"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { ipcRenderer } from "electron"

import globalEmitter from "etc/globalEmitter"
import { updateContentState } from "etc/actions"

@withRouter
@connect((state, props) => {
  const { notes } = state
  const { match: { params: { noteId } } } = props
  return { note: { id: noteId, ...notes[noteId] } }
})
@autobind
export default class NotePane extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    note: PropTypes.object
  }

  constructor(props) {
    super(props)

    if (props.note.id) {
      this.state = {
        editorState: EditorState.createWithContent(this.props.note.contentState ? convertFromRaw(JSON.parse(this.props.note.contentState)) : "")
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }
  }

  componentDidMount() {
    globalEmitter.on("focus-editor", () => this.setState({
      editorState: EditorState.moveFocusToEnd(this.state.editorState)
    }))
  }

  componentWillUpdate(nextProps) {
    if (nextProps.note.id !== this.props.note.id) {
      if (nextProps.note.id) {
        this.setState({
          editorState: EditorState.createWithContent(nextProps.note.contentState ? convertFromRaw(JSON.parse(nextProps.note.contentState)) : "")
        })
      } else {
        this.setState({
          editorState: EditorState.createEmpty()
        })
      }
    }
  }

  render() {
    const { note } = this.props
    if (!note) return <section className="NotePane" />
    return (
      <section className="NotePane" onClick={this.handleClick}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.handleChange}
          ref={editor => this.editor = editor}
          onEscape={this.handleEscape}
          keyBindingFn={event => {
            if (event.key === "f" && hasCommandModifier(event)) {
              return "external:search"
            }
            return getDefaultKeyBinding(event)
          }}
          handleKeyCommand={command => {
            if (command === "external:search") {
              globalEmitter.emit("focus-search")
              return "handled"
            }
            return "not-handled"
          }}
        />
      </section>
    )
  }

  handleChange(editorState) {
    const { dispatch, note } = this.props
    this.setState({ editorState })
    if (editorState.getCurrentContent() !== this.state.editorState.getCurrentContent()) {
      dispatch(updateContentState(note.id, editorState.getCurrentContent()))
    }
  }

  handleEscape() {
    ipcRenderer.send("hide-window")
  }

}
