import "./FilterSelect.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import CaretIcon from "assets/caret-down"

export default class FilterSelect extends Component {

  static propTypes = {
    filter: PropTypes.string,
    onChange: PropTypes.func
  }

  render() {
    const { filter, onChange } = this.props
    return (
      <div className={classNames("FilterSelect", `filter-${filter}`)}>

        { filter === "deleted" ? "Deleted notes" : "All notes" }

        <CaretIcon />

        <select value={filter} onChange={onChange}>
          <option value="all">All notes</option>
          <option value="deleted">Deleted notes</option>
        </select>

      </div>
    )
  }

}
