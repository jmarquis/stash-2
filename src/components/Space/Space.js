import "./Space.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { Route } from "react-router"

import ListPane from "components/ListPane"
import NotePane from "components/NotePane"

export default class Space extends Component {

  static propTypes = {
    match: PropTypes.object
  }

  render() {
    const { match } = this.props
    return (
      <div className="Space">
        <ListPane />
        <Route path={`${match.url}/:noteId`} component={NotePane} />
      </div>
    )
  }

}



// TODO: fix backspace/selection state weirdness
// TODO: fix app only showing up on one desktop
// TODO: sort notes by most frequently modified
// TODO: support creating a note from the search box
// TODO: keyboard bindings for navigating list & focusing note
// TODO: figure out window styling
// TODO: figure out list pane preview truncate length or something
// TODO: deleting a note? trash view?
//
// LATER: firebase
