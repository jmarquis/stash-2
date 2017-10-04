import "./App.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { ipcRenderer } from "electron"
import { bind } from "mousetrap"
import { Route, Switch, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { withRouter } from "react-router"

import globalEmitter from "etc/globalEmitter"
import { createNote } from "actions"

import Space from "components/Space"

@withRouter
@connect((state, props) => {
  const { spaces } = state
  const { match: { location } } = props
  const defaultSpaceId = Object.keys(spaces)[0]
  return { location, defaultSpaceId }
})
export default class App extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    defaultSpaceId: PropTypes.string
  }

  componentDidMount() {

    const { dispatch, defaultSpaceId } = this.props

    bind("esc", () => ipcRenderer.send("hide-window"))
    bind("command+n", () => dispatch(createNote(defaultSpaceId))) // TODO: focus the new note
    bind("command+f", () => globalEmitter.emit("focus-search"))

    ipcRenderer.on("create-note", () => dispatch(createNote(defaultSpaceId))) // TODO: focus the new note

  }

  render() {
    const { defaultSpaceId } = this.props
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <Redirect to={`/${defaultSpaceId}`} />} />
          <Route path="/:spaceId/:noteId?" component={Space} />
        </Switch>
      </div>
    )
  }

}
