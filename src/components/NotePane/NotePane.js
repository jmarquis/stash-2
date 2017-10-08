import "./NotePane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Editor, EditorState, convertFromRaw, getDefaultKeyBinding, KeyBindingUtil } from "draft-js"
const { hasCommandModifier } = KeyBindingUtil
import autobind from "autobind-decorator"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { ipcRenderer } from "electron"
import classNames from "classnames"

import globalEmitter from "etc/globalEmitter"
import { updateContentState, toggleNoteDeleted } from "etc/actions"

import DeleteIcon from "assets/trash"

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
    globalEmitter.on("focus-editor", () => {
      this.setState({
        editorState: EditorState.moveFocusToEnd(this.state.editorState)
      }, () => {
        const selection = window.getSelection()
        if (selection.rangeCount !== 0) {
          let node = selection.getRangeAt(0).startContainer
          do {
            if (node.nodeType === 1 && node.scrollIntoViewIfNeeded) {
              node.scrollIntoViewIfNeeded(false)
              break
            }
            node = node.parentNode
          } while (node)
        }
      })
    })
  }

  componentWillUpdate(nextProps) {
    if (nextProps.note.id !== this.props.note.id) {
      if (nextProps.note.id) {
        this.pane.scrollTop = 0
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
    return (
      <section className={classNames("NotePane", { "note-deleted": note.deleted })} ref={pane => this.pane = pane}>
        {(() => {
          if (note && note.id) {
            return [

              <Editor
                key={1}
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
              />,

              <button key={2} onClick={this.handleDeleteClick} title={ note.deleted ? "Restore this note" : "Delete this note" }>
                <DeleteIcon />
              </button>

            ]
          }
        })()}
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

  handleDeleteClick() {
    const { dispatch, note } = this.props
    dispatch(toggleNoteDeleted(note.id, !note.deleted))
  }

}
