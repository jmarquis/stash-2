import "./App.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { ipcRenderer } from "electron"
import { bind } from "mousetrap"
import { Route, Switch, Redirect } from "react-router-dom"
import { connect } from "react-redux"

import Space from "components/Space"

@connect(state => {
  const { spaces } = state
  const defaultSpaceId = Object.keys(spaces)[0]
  return { defaultSpaceId }
})
export default class App extends Component {

  static propTypes = {
    defaultSpaceId: PropTypes.string
  }

  componentDidMount() {
    bind("esc", () => ipcRenderer.send("hide-window"))
  }

  render() {
    const { defaultSpaceId } = this.props
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <Redirect to={`/${defaultSpaceId}`} />} />
          <Route path="/:spaceId" component={Space} />
        </Switch>
      </div>
    )
  }

}
