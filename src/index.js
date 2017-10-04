import "styles/base"

import React from "react"
import { render } from "react-dom"
import { AppContainer } from "react-hot-loader"
import { Provider } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { createLogger } from "redux-logger"
import createHistory from "history/createBrowserHistory"
import { ConnectedRouter, routerReducer, routerMiddleware } from "react-router-redux"

import localData from "etc/localData"

import App from "components/App"

import * as reducers from "reducers"

const history = createHistory()

const middleware = [thunk, routerMiddleware(history)]

if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger({
    level: "info",
    collapsed: true,
    diff: true
  }))
}

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  {
    spaces: localData.get("spaces"),
    notes: localData.get("notes")
  },
  applyMiddleware(...middleware)
)

const renderApp = AppComponent => render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AppComponent user="whatever" />
      </ConnectedRouter>
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
