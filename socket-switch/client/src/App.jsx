import React, { Component } from "react";
import "./App.css";
import {
  statusEventListener,
  emitToggle,
  closeSocket
} from "./services/websocket";

class App extends Component {
  state = {
    button: false
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
        this.setState({ button: data.buttonStatus });
      }
    });
  };

  render() {
    return (
      <div className="App">
        <h1>Hi</h1>
      </div>
    );
  }
}

export default App;
