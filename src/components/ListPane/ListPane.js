import "./ListPane.less"

import React, { Component } from "react"
import { ipcRenderer } from "electron"

export default class ListPane extends Component {

  componentDidMount() {
    ipcRenderer.on("focus-search", () => {
      this.searchField.focus()
      this.searchField.select()
    })
  }

  render() {
    return (
      <nav className="ListPane">

        <header>
          <input
            type="text"
            placeholder="Search or add"
            ref={searchField => this.searchField = searchField}
            onKeyDown={this.handleSearchKeyDown}
          />
        </header>

        <ul>
          <li>
            <a>
              <p>Upcoming trips</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec et tu ita posuisti, et verba...</p>
            </a>
          </li>
          <li>
            <a>
              <p>Upcoming trips and other similar things</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec et tu ita posuisti, et verba...</p>
            </a>
          </li>
          <li>
            <a>
              <p>Upcoming trips</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec et tu ita posuisti, et verba...</p>
            </a>
          </li>
          <li>
            <a>
              <p>Upcoming trips</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec et tu ita posuisti, et verba...</p>
            </a>
          </li>
          <li>
            <a>
              <p>Upcoming trips</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec et tu ita posuisti, et verba...</p>
            </a>
          </li>
        </ul>

      </nav>
    )
  }

  handleSearchKeyDown(event) {
    if (event.key === "Escape") ipcRenderer.send("hide-window")
  }

}
