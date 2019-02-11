import React, { Component } from "react";
import Switch from "react-switch";
import "./App.css";
import {
  statusEventListener,
  emitToggle,
  closeSocket
} from "./services/websocket";

class App extends Component {
  state = {
    buttonStatus: false
  };
  componentDidMount() {
    this.ejected = false;
    this.bindStatusEventListener();
  }

  componentWillUnmount() {
    this.ejected = true;
    closeSocket();
  }

  bindStatusEventListener = () => {
    statusEventListener((err, data) => {
      if (!this.ejected) {
        this.setState({ buttonStatus: data.buttonStatus });
      }
    });
  };

  handleChange = buttonStatus => {
    this.setState({ buttonStatus });
    emitToggle();
  };

  render() {
    return (
      <div id="app">
        <p>
          Switch the light <strong>ON</strong> or <strong>OFF</strong>
        </p>
        <Switch
          onChange={this.handleChange}
          checked={this.state.buttonStatus}
        />
      </div>
    );
  }
}

export default App;
