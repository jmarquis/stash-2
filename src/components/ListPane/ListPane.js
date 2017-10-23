import "./ListPane.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { ipcRenderer } from "electron"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { convertFromRaw } from "draft-js"
import autobind from "autobind-decorator"
import moment from "moment"
import { push } from "react-router-redux"
import { Base64 } from "js-base64"

import globalEmitter from "etc/globalEmitter"
import { updateQuery, updateFilter } from "etc/actions"

import SearchField from "components/SearchField"
import List from "components/List"
import FilterSelect from "components/FilterSelect"

import AddIcon from "assets/plus"

@withRouter
@connect((state, props) => {
  let { notes, query, filter } = state
  const { match: { params: { spaceId } } } = props
  notes = Object.keys(notes)
    .filter(noteId => notes[noteId].spaceId === spaceId && convertFromRaw(JSON.parse(notes[noteId].contentState)).getPlainText().toLowerCase().includes(query.toLowerCase()))
    .filter(noteId => filter === "deleted" ? notes[noteId].deleted : !notes[noteId].deleted)
    .map(noteId => ({ id: noteId, ...notes[noteId] }))
    .sort((noteA, noteB) => {
      const noteALastModified = moment(noteA.lastModified)
      const noteBLastModified = moment(noteB.lastModified)
      if (noteBLastModified.isBefore(noteALastModified)) return -1
      else if (noteALastModified.isBefore(noteBLastModified)) return 1
      else return 0
    })
  return { notes, query, filter }
})
@autobind
export default class ListPane extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    notes: PropTypes.object,
    match: PropTypes.object,
    query: PropTypes.string,
    filter: PropTypes.string
  }

  componentDidMount() {
    const { dispatch, notes, match: { params: { spaceId, noteId } } } = this.props
    if (!noteId) {
      dispatch(push(`/${spaceId}/${notes[0].id}`))
    }
  }

  componentDidUpdate() {
    const { dispatch, notes, query, match: { url, params: { spaceId, noteId } } } = this.props
    if (notes.length && !query && !notes.find(note => note.id === noteId)) {
      dispatch(push(`/${spaceId}/${notes[0].id}`))
    } else if (!notes.length) {
      if (query && url !== `/${spaceId}/new/${Base64.encodeURI(query)}`) {
        dispatch(push(`/${spaceId}/new/${Base64.encodeURI(query)}`))
      } else if (!query && url !== `/${spaceId}`) {
        dispatch(push(`/${spaceId}`))
      }
    }
  }

  render() {

    const { match: { params: { spaceId } }, notes, query, filter } = this.props

    const listItems = notes.map(note => {

      let text = convertFromRaw(JSON.parse(note.contentState)).getPlainText()
      if (text) {
        text = text
          .split("\n")
          .slice(0, 2)
          .map((line, index) =>
            <p key={index}>
              {line}
            </p>
          )
      } else {
        text = <p>New note</p>
      }

      return {
        id: note.id,
        url: `/${spaceId}/${note.id}`,
        content: text
      }

    })

    if (filter === "all" && query) {
      listItems.push({
        id: "new",
        url: `/${spaceId}/new/${Base64.encodeURI(query)}`,
        content: [
          <AddIcon key={0} />,
          <p key={1}>{query}</p>
        ],
        className: "new",
        onClick: event => {
          event.preventDefault()
          globalEmitter.emit("create-note", query)
        }
      })
    }

    return (
      <nav className="ListPane">

        <header>
          <SearchField
            value={query}
            onChange={this.handleQueryChange}
            onKeyDown={this.handleKeyDown}
            onClear={this.clearQuery}
          />
        </header>

        <List
          items={listItems}
          onKeyDown={this.handleKeyDown}
        />

        <footer>
          <FilterSelect filter={filter} onChange={this.handleFilterChange} />
        </footer>

      </nav>
    )

  }

  handleQueryChange(event) {
    const { dispatch } = this.props
    dispatch(updateQuery(event.target.value))
  }

  handleKeyDown(event) {
    const { match: { params: { newNoteTitle } } } = this.props
    if (event.key === "Escape") {
      event.preventDefault()
      ipcRenderer.send("hide-window")
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      globalEmitter.emit("select-next-item")
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      globalEmitter.emit("select-previous-item")
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (newNoteTitle) {
        globalEmitter.emit("create-note", Base64.decode(newNoteTitle))
      } else {
        globalEmitter.emit("focus-editor")
      }
    }
  }

  clearQuery() {
    const { dispatch } = this.props
    dispatch(updateQuery(""))
  }

  handleFilterChange(event) {
    const { dispatch } = this.props
    dispatch(updateFilter(event.target.value))
  }

}
