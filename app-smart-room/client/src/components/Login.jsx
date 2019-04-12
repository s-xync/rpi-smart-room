import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import "./css/Login.css";
import { appLogin } from "../store/actions/authActions";

class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  componentDidUpdate(prevProps) {
    if (this.props.loggedIn) {
      const path = JSON.parse(localStorage.getItem("path"));
      localStorage.removeItem("path");
      if (path) {
        this.props.history.push(path);
      } else {
        this.props.history.push("/");
      }
    }
  }

  inputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  loginClicked = e => {
    const { appLogin } = this.props;
    const { email, password } = this.state;
    appLogin({ email, password });
    this.setState({
      email: "",
      password: ""
    });
    e.preventDefault();
  };

  render() {
    return (
      <Fragment>
        <br />
        <main>
          <center>
            <h5 className="indigo-text">Please, login into your account</h5>
            <br />
            <div className="form-container">
              <div className="z-depth-1 grey lighten-4 row">
                <form className="col s12" onSubmit={this.loginClicked}>
                  <div className="row">
                    <div className="col s12" />
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="email"
                        name="email"
                        id="email"
                        value={this.state.email}
                        onChange={this.inputChange}
                      />
                      <label htmlFor="email">Enter your email</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="password"
                        name="password"
                        id="password"
                        value={this.state.password}
                        onChange={this.inputChange}
                      />
                      <label htmlFor="password">Enter your password</label>
                    </div>

                    <small className="pink-text">
                      {this.props.authErrorMsg}
                    </small>
                  </div>
                  <br />
                  <center>
                    <div className="row">
                      <button
                        type="submit"
                        name="btn_login"
                        className="col s12 btn btn-large waves-effect waves-light blue"
                        onClick={this.loginClicked}
                      >
                        Login
                      </button>
                    </div>
                  </center>
                </form>
              </div>
            </div>
          </center>
          <br />
          <footer className="page-footer red darken-4" />
        </main>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    loggedIn: auth.loggedIn,
    authErrorMsg: auth.authErrorMsg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    appLogin: credentials => dispatch(appLogin(credentials))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
