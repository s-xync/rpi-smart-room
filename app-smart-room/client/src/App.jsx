import React, { Component } from "react";
import Switch from "react-switch";
import axios from "axios";
import "./App.css";
import {
  statusEventListener,
  emitSetLightSwitchStatus,
  emitSetLightSwitchAutomatic,
  closeSocket
} from "./services/websocket";

class App extends Component {
  state = {
    lightSwitchStatus: false,
    lightSwitchAutomatic: false,
    temperature: 0,
    humidity: 0
  };

  componentDidMount() {
    console.log(process.env.REACT_APP_SERVER_URL);
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
        } else {
          console.log(response.data.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  bindStatusEventListener = () => {
    statusEventListener((err, lightSwitch) => {
      if (!this.ejected) {
        this.setState({
          lightSwitchStatus: lightSwitch.status,
          lightSwitchAutomatic: lightSwitch.automatic
        });
      }
    });
  };

  handleChangeLightSwitch = lightSwitchStatus => {
    this.setState({ lightSwitchStatus });
    emitSetLightSwitchStatus(lightSwitchStatus);
  };

  handleChangeLightSwitchAutomatic = lightSwitchAutomatic => {
    this.setState({ lightSwitchAutomatic });
    emitSetLightSwitchAutomatic(lightSwitchAutomatic);
  };

  render() {
    return (
      <div id="app">
        <p className="heading">
          Switch the light <strong>ON</strong> or <strong>OFF</strong>
        </p>
        <Switch
          onChange={this.handleChangeLightSwitchAutomatic}
          checked={this.state.lightSwitchAutomatic}
        />
        <Switch
          onChange={this.handleChangeLightSwitch}
          checked={this.state.lightSwitchStatus}
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
