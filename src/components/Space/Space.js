import "./Space.less"

import React, { Component } from "react"
import PropTypes from "prop-types"

import ListPane from "components/ListPane"
import NotePane from "components/NotePane"

export default class Space extends Component {

  static propTypes = {
    match: PropTypes.object
  }

  render() {
    return (
      <div className="Space">
        <ListPane />
        <NotePane />
      </div>
    )
  }

}
