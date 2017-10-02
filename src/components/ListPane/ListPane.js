import "./ListPane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { ipcRenderer } from "electron"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { convertFromRaw } from "draft-js"

@withRouter
@connect((state, props) => {
  let { notes } = state
  const { match: { params: { spaceId } } } = props
  notes = Object.keys(notes).filter(noteId => notes[noteId].spaceId === spaceId).map(noteId => ({ id: noteId, ...notes[noteId] }))
  return { notes }
})
export default class ListPane extends Component {

  static propTypes = {
    notes: PropTypes.object
  }

  componentDidMount() {
    ipcRenderer.on("focus-search", () => {
      this.searchField.focus()
      this.searchField.select()
    })
  }

  render() {
    const { notes } = this.props
    return (
      <nav className="ListPane">

        <header>
          <input
            type="text"
            placeholder="Search or add"
            ref={searchField => this.searchField = searchField}
            onKeyDown={this.handleSearchKeyDown}
          />
        </header>

        <ul>
          {
            notes.map(note =>
              <li key={note.id}>
                <a>
                  {convertFromRaw(JSON.parse(note.contentState)).getPlainText()}
                </a>
              </li>
            )
          }
        </ul>

      </nav>
    )
  }

  handleSearchKeyDown(event) {
    if (event.key === "Escape") ipcRenderer.send("hide-window")
  }

}
