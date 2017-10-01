import "./Space.less"

import React, { Component } from "react"

import ListPane from "components/ListPane"
import NotePane from "components/NotePane"

export default class Space extends Component {

  render() {
    return (
      <div className="Space">
        <ListPane />
        <NotePane />
      </div>
    )
  }

}
