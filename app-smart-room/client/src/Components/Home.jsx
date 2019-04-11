import React, { Component } from "react";
import Switch from "react-switch";
import axios from "axios";
import "./Home.css";
import {
  statusEventListener,
  emitSetLightSwitchStatus,
  emitSetLightSwitchAutomatic,
  closeSocket
} from "../services/websocket";

class Home extends Component {
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

  handleChangeLightSwitchStatus = lightSwitchStatus => {
    this.setState({ lightSwitchStatus });
    emitSetLightSwitchStatus(lightSwitchStatus);
  };

  handleChangeLightSwitchAutomatic = lightSwitchAutomatic => {
    this.setState({ lightSwitchAutomatic });
    emitSetLightSwitchAutomatic(lightSwitchAutomatic);
  };

  render() {
    return (
      <div id="app" className="container">
        <h1>Smarty Room</h1>
        <hr />
        <h2>Control</h2>
        <div className="row align-items-center">
          <div className="col-md-2 col-sm-4">
            <h4>Automatic: </h4>
          </div>
          <div className="col-md-2 col-sm-4">
            <Switch
              className="app-switch"
              onChange={this.handleChangeLightSwitchAutomatic}
              checked={this.state.lightSwitchAutomatic}
            />
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-md-2 col-sm-4">
            <h4>Switch: </h4>
          </div>
          <div className="col-md-2 col-sm-4">
            <Switch
              className="app-switch"
              onChange={this.handleChangeLightSwitchStatus}
              checked={this.state.lightSwitchStatus}
              disabled={this.state.lightSwitchAutomatic}
            />
          </div>
        </div>
        <br />
        <h2>Conditions</h2>
        <div className="row align-items-center">
          <div className="col-md-2 col-sm-4">
            <h4>Temperature: </h4>
          </div>
          <div className="col-md-2 col-sm-4">
            <h4 className="numbers">{this.state.temperature + "⁰c"}</h4>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-md-2 col-sm-4">
            <h4>Humidity: </h4>
          </div>
          <div className="col-md-2 col-sm-4">
            <h4 className="numbers">{this.state.humidity + "%RH"}</h4>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-outline-primary refresh-button"
          onClick={this.getTempAndHumid}
        >
          Refresh
        </button>
      </div>
    );
  }
}

export default Home;
