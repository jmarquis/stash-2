import "./NotePane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Editor, EditorState, convertFromRaw } from "draft-js"
import autobind from "autobind-decorator"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { ipcRenderer } from "electron"

import globalEmitter from "etc/globalEmitter"
import { updateContentState } from "actions"

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

  state = {
    editorState: EditorState.createWithContent(this.props.note.contentState ? convertFromRaw(JSON.parse(this.props.note.contentState)) : "")
  }

  componentDidMount() {
    globalEmitter.on("focus-editor", () => this.setState({
      editorState: EditorState.moveFocusToEnd(this.state.editorState)
    }))
  }

  componentWillUpdate(nextProps) {
    if (nextProps.note.id !== this.props.note.id) {
      this.setState({
        editorState: EditorState.createWithContent(nextProps.note.contentState ? convertFromRaw(JSON.parse(nextProps.note.contentState)) : "")
      })
    }
  }

  render() {
    const { note } = this.props
    if (!note) return null
    return (
      <section className="NotePane" onClick={this.handleClick}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.handleChange}
          ref={editor => this.editor = editor}
          onEscape={this.handleEscape}
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
