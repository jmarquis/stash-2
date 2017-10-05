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
    value: PropTypes.value,
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
    const { value, ...otherProps } = this.props
    const { focused } = this.state
    return (
      <div className={classNames("SearchField", { focused })}>
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
  }

}
