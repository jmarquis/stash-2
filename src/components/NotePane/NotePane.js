import "./NotePane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Editor, EditorState, convertFromRaw } from "draft-js"
import autobind from "autobind-decorator"
import { connect } from "react-redux"

import { updateContentState } from "actions"

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
    editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.note.contentState)))
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
        />
      </section>
    )
  }

  handleChange(editorState) {
    const { dispatch, note } = this.props
    this.setState({ editorState })
    dispatch(updateContentState(note.id, editorState.getCurrentContent()))
  }

  handleClick() {
    this.editor.focus()
  }

}
