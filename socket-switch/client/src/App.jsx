import React, { Component } from "react";
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

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <h1>Hi</h1>
      </div>
    );
  }
}

export default App;
