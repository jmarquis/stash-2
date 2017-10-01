import "./App.less"

import React, { Component } from "react"
import PropTypes from "prop-types"
import { ipcRenderer } from "electron"
import { bind } from "mousetrap"
import { Route, Switch, Redirect } from "react-router-dom"

export default class App extends Component {

  static propTypes = {
    user: PropTypes.object
  }

  componentDidMount() {

    ipcRenderer.on("focus-search", () => {
      this.searchField.focus()
      this.searchField.select()
    })

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
                <Route path="/:spaceId" render={() => <div>space</div>} />
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

    return (
      <div className="App">

        <nav>
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

        <section>
          <p>Words and other things that sound like words</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egone non intellego, quid sit don Graece, Latine voluptas? Universa enim illorum ratione cum tota vestra confligendum puto. Nihil opus est exemplis hoc facere longius. Verum hoc loco sumo verbis his eandem certe vim voluptatis Epicurum nosse quam ceteros. Fortitudinis quaedam praecepta sunt ac paene leges, quae effeminari virum vetant in dolore. Duo Reges: constructio interrete.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quae similitudo in genere etiam humano apparet. Prioris generis est docilitas, memoria; Eodem modo is enim tibi nemo dabit, quod, expetendum sit, id esse laudabile. Non quam nostram quidem, inquit Pomponius iocans; Aliter enim explicari, quod quaeritur, non potest. Tollitur beneficium, tollitur gratia, quae sunt vincla concordiae.</p>
        </section>

      </div>
    )
  }

  handleSearchKeyDown(event) {
    if (event.key === "Escape") ipcRenderer.send("hide-window")
  }

}
