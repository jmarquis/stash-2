import "./SearchField.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import autobind from "autobind-decorator"

import globalEmitter from "etc/globalEmitter"

import SearchIcon from "assets/magnifying-glass"
import ClearIcon from "assets/x-circle"

@autobind
export default class SearchField extends Component {

  static propTypes = {
    value: PropTypes.string,
    onClear: PropTypes.func
  }

  state = {
    focused: false
  }

  componentDidMount() {

    globalEmitter.on("focus-search", () => {
      this.searchField.focus()
      this.searchField.select()
    })

  }

  render() {
    const { value, onClear, ...otherProps } = this.props // eslint-disable-line no-unused-vars
    const { focused } = this.state
    return (
      <div className={classNames("SearchField", { focused }, { empty: !value })} onClick={this.focus}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search or add"
          ref={searchField => this.searchField = searchField}
          value={value}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          {...otherProps}
        />
        { value && <button onClick={this.clearQuery}><ClearIcon /></button> }
      </div>
    )
  }

  focus() {
    this.searchField.focus()
  }

  handleFocus() {
    this.setState({
      focused: true
    })
  }

  handleBlur() {
    this.setState({
      focused: false
    })
  }

  clearQuery() {
    this.props.onClear()
    this.focus()
  }

}
