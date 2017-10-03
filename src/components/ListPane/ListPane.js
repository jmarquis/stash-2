import "./ListPane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { ipcRenderer } from "electron"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { NavLink } from "react-router-dom"
import { convertFromRaw } from "draft-js"
import autobind from "autobind-decorator"
import moment from "moment"

import { updateQuery } from "actions"

@withRouter
@connect((state, props) => {
  let { notes, query } = state
  const { match: { params: { spaceId } } } = props
  notes = Object.keys(notes)
    .filter(noteId => notes[noteId].spaceId === spaceId && convertFromRaw(JSON.parse(notes[noteId].contentState)).getPlainText().toLowerCase().includes(query.toLowerCase()))
    .map(noteId => ({ id: noteId, ...notes[noteId] }))
    .sort((noteA, noteB) => {
      const noteALastModified = moment(noteA.lastModified)
      const noteBLastModified = moment(noteB.lastModified)
      if (noteBLastModified.isBefore(noteALastModified)) return -1
      else if (noteALastModified.isBefore(noteBLastModified)) return 1
      else return 0
    })
  return { notes, query }
})
@autobind
export default class ListPane extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    notes: PropTypes.object,
    match: PropTypes.object,
    query: PropTypes.string
  }

  componentDidMount() {
    ipcRenderer.on("focus-search", () => {
      this.searchField.focus()
      this.searchField.select()
    })
  }

  render() {
    const { match, notes, query } = this.props
    return (
      <nav className="ListPane">

        <header>
          <input
            type="text"
            placeholder="Search or add"
            ref={searchField => this.searchField = searchField}
            onKeyDown={this.handleQueryKeyDown}
            onChange={this.handleQueryChange}
            value={query}
          />
        </header>

        <ul>
          {
            notes.map(note => {
              const text = convertFromRaw(JSON.parse(note.contentState)).getPlainText()
              return (
                <li key={note.id}>
                  <NavLink to={`${match.url}/${note.id}`}>
                    { text ? text.split("\n").slice(0, 2).map((line, index) => <p key={index}>{ index === 1 && line.length > 80 ? `${line.substr(0, 80)}...` : line }</p>) : <p>New note</p> }
                  </NavLink>
                </li>
              )
            })
          }
        </ul>

      </nav>
    )
  }

  handleQueryKeyDown(event) {
    if (event.key === "Escape") ipcRenderer.send("hide-window")
  }

  handleQueryChange(event) {
    const { dispatch } = this.props
    dispatch(updateQuery(event.target.value))
  }

}
