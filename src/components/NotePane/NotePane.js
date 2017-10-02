import "./NotePane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Editor, EditorState, convertFromRaw } from "draft-js"
import autobind from "autobind-decorator"
import { connect } from "react-redux"

@connect((state, props) => {
  const { notes } = state
  const { match: { params: { noteId } } } = props
  return { note: notes[noteId] }
})
@autobind
export default class NotePane extends Component {

  static propTypes = {
    note: PropTypes.object
  }

  state = {
    editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.note.contentState)))
  }

  render() {
    const { note } = this.props
    if (!note) return null
    return (
      <section className="NotePane">
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
      </section>
    )
  }

  onChange(editorState) {
    this.setState({ editorState })
  }

}
