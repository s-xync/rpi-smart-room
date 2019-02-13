import React, { Component } from "react";
import Switch from "react-switch";
import axios from "axios";
import "./App.css";
import {
  statusEventListener,
  emitToggle,
  closeSocket
} from "./services/websocket";

class App extends Component {
  state = {
    buttonStatus: false,
    temperature: 0,
    humidity: 0
  };

  componentDidMount() {
    this.ejected = false;
    this.bindStatusEventListener();
    this.getTempAndHumid();
  }

  componentWillUnmount() {
    this.ejected = true;
    closeSocket();
  }

  getTempAndHumid = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/tempandhumid")
      .then(response => {
        if (response.data.success) {
          const { temperature, humidity } = response.data.message;
          this.setState({ temperature, humidity });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

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
        <p className="heading">
          Switch the light <strong>ON</strong> or <strong>OFF</strong>
        </p>
        <Switch
          onChange={this.handleChange}
          checked={this.state.buttonStatus}
        />
        <br />
        <br />
        <p className="heading">Temperature and Humidity</p>
        <p>{this.state.temperature}⁰C</p>
        <p>{this.state.humidity}%RH</p>
        <button className="refresh-button" onClick={this.getTempAndHumid}>
          Refresh
        </button>
      </div>
    );
  }
}

export default App;
