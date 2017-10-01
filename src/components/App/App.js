import "./App.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { ipcRenderer } from "electron"
import { bind } from "mousetrap"
import { Route, Switch, Redirect } from "react-router-dom"

import Space from "components/Space"

export default class App extends Component {

  static propTypes = {
    user: PropTypes.object
  }

  componentDidMount() {
    bind("esc", () => ipcRenderer.send("hide-window"))
  }

  render() {
    const { user } = this.props
    return (
      <div className="App">
        {(() => {
          if (user) {
            return (
              <Switch>
                <Route exact path="/" render={() => <div><Redirect to="/123" /></div>} />
                <Route path="/:spaceId" component={Space} />
              </Switch>
            )
          } else if (user === false) {
            return <div>auth</div>
          } else {
            return <div>loading</div>
          }
        })()}
      </div>
    )
  }

}
