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



// NEXT: electron-store
// persist stuff locally
// load initial state into redux from electron-store on launch
// wire up routes for notes, etc
// wire up action for creating new notes via Enter key
// hotkey for new notes (command N)
// throttle saves to electron-store while typing
//
// LATER: firebase
