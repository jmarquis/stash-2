import "./App.less"

import React, { Component } from "react"
import { ipcRenderer } from "electron"
import { bind } from "mousetrap"
import { Route, Switch, Redirect } from "react-router-dom"

import Space from "components/Space"

export default class App extends Component {

  componentDidMount() {
    bind("esc", () => ipcRenderer.send("hide-window"))
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <div><Redirect to="/123" /></div>} />
          <Route path="/:spaceId" component={Space} />
        </Switch>
      </div>
    )
  }

}
