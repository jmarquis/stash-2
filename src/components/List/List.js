import "./List.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { NavLink } from "react-router-dom"
import { withRouter } from "react-router"
import { connect } from "react-redux"
import { push } from "react-router-redux"

import globalEmitter from "etc/globalEmitter"

@withRouter
@connect()
export default class List extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    items: PropTypes.array,
    match: PropTypes.object,
    onKeyDown: PropTypes.func
  }

  componentDidMount() {

    const { dispatch, items, match: { url } } = this.props

    globalEmitter.on("select-next-note", () => {
      const index = items.findIndex(item => item.url === url)
      if (items[index + 1]) {
        dispatch(push(items[index + 1].url))
        setTimeout(() => {
          this.list.querySelector(".active").scrollIntoViewIfNeeded()
        }, 100)
      }
    })

    globalEmitter.on("select-previous-note", () => {
      const index = items.findIndex(item => item.url === url)
      if (items[index - 1]) {
        dispatch(push(items[index - 1].url))
        setTimeout(() => {
          this.list.querySelector(".active").scrollIntoViewIfNeeded()
        }, 100)
      }
    })

  }

  render() {
    const { items, onKeyDown } = this.props // eslint-disable-line no-unused-vars
    return (
      <ul
        className="List"
        ref={list => this.list = list}
        onKeyDown={onKeyDown}
      >
        {
          items.map(item => {
            return (
              <li key={item.id}>
                <NavLink to={item.url} tabIndex={-1}>
                  { item.content }
                </NavLink>
              </li>
            )
          })
        }
      </ul>
    )
  }

}
