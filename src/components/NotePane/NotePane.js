import "./NotePane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Editor, EditorState, convertFromRaw } from "draft-js"
import autobind from "autobind-decorator"
import { connect } from "react-redux"

import { updateEditorState } from "actions"

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

  componentDidMount() {
    this.editor.focus()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.note.id !== this.props.note.id) {
      this.editor.focus()
    }
  }

  render() {
    const { note } = this.props
    if (!note) return null
    return (
      <section className="NotePane" onClick={this.handleClick}>
        <Editor
          editorState={note.editorState || EditorState.createWithContent(convertFromRaw(JSON.parse(note.contentState)))}
          onChange={this.handleChange}
          ref={editor => this.editor = editor}
        />
      </section>
    )
  }

  handleChange(editorState) {
    const { dispatch, note } = this.props
    dispatch(updateEditorState(note.id, editorState))
  }

  handleClick() {
    this.editor.focus()
  }

}
