import "styles/base"

import React from "react"
import { render } from "react-dom"
import { AppContainer } from "react-hot-loader"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { createLogger } from "redux-logger"

import App from "components/App"

import * as reducers from "reducers"

const middleware = [thunk]

if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger({
    level: "info",
    collapsed: true,
    diff: true
  }))
}

const store = createStore(combineReducers(reducers), applyMiddleware(...middleware))

const renderApp = AppComponent => render(
  <AppContainer>
    <Provider store={store}>
      <Router>
        <AppComponent user="whatever" />
      </Router>
    </Provider>
  </AppContainer>,
  document.getElementById("root")
)

renderApp(App)

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NewApp = require("./components/App").default
    renderApp(NewApp)
  })
}
