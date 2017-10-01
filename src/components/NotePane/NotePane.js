import "./NotePane.less"

import React, { Component } from "react"
import { Editor, EditorState } from "draft-js"
import autobind from "autobind-decorator"

@autobind
export default class NotePane extends Component {

  state = {
    editorState: EditorState.createEmpty()
  }

  render() {
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
