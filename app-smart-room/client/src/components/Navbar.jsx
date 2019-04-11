import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import M from "materialize-css/dist/js/materialize.min.js";

import "./css/Navbar.css";
import { appLogout } from "../store/actions/authActions";

class Navbar extends Component {
  componentDidMount() {
    const elem = document.querySelector(".sidenav");
    M.Sidenav.init(elem, {
      edge: "left",
      inDuration: 250
    });
  }

  render() {
    return (
      <Fragment>
        <nav>
          <div className="nav-wrapper">
            <NavLink className="brand-logo" to="/">
              Smarty Room
            </NavLink>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              {this.props.loggedIn && (
                <li>
                  <a onClick={this.props.appLogout}>Logout</a>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <ul className="sidenav" id="mobile-demo">
          {this.props.loggedIn && (
            <li>
              <a onClick={this.props.appLogout}>Logout</a>
            </li>
          )}
        </ul>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    loggedIn: auth.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    appLogout: () => dispatch(appLogout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
