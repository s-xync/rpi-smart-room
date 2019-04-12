import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { getTokenInfo } from "./store/actions/authActions";
import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";

const ProtectedRoute = ({ isAllowed, ...props }) => {
  const propsObject = { ...props };
  localStorage.setItem("path", JSON.stringify(propsObject.location.pathname));
  return isAllowed ? <Route {...props} /> : <Redirect to="/login" />;
};

class App extends Component {
  componentWillMount() {
    // if logged in, it is fine
    // or else, it will log us out
    this.props.getTokenInfo();
  }

  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Switch>
            <Route path="/login" exact component={Login} />
            <ProtectedRoute
              path="/"
              exact
              isAllowed={this.props.loggedIn}
              component={Home}
            />
            <Route component={Login} />
          </Switch>
        </Fragment>
      </BrowserRouter>
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
    getTokenInfo: () => dispatch(getTokenInfo())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
