import React, { Component, Fragment } from "react";
import axios from "axios";
import Switch from "react-switch";
import "./css/Home.css";
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
      <Fragment>
        <div className="container home">
          <br />
          <div className="section">
            <div className="row">
              <div className="col s12 m6 center">
                <div className="card-panel white ">
                  <span className="light text-darken-1 blue-text">
                    <span className="card-heading">Automatic Mode</span>
                    <div className="switch">
                      <label>
                        <Switch
                          className="app-switch"
                          onChange={this.handleChangeLightSwitchAutomatic}
                          checked={this.state.lightSwitchAutomatic}
                        />
                      </label>
                    </div>
                  </span>
                </div>
              </div>
              <div className="col s12 m6 center">
                <div
                  className={
                    "card-panel " +
                    (this.state.lightSwitchAutomatic ? "faded " : " ") +
                    (this.state.lightSwitchAutomatic &&
                    this.state.lightSwitchStatus
                      ? "green lighten-2"
                      : "white")
                  }
                >
                  <span className="light text-darken-2 blue-text">
                    <span className="card-heading">Switch</span>
                    <div className="switch">
                      <label>
                        <Switch
                          className="app-switch"
                          onChange={this.handleChangeLightSwitchStatus}
                          checked={this.state.lightSwitchStatus}
                          disabled={this.state.lightSwitchAutomatic}
                        />
                      </label>
                    </div>
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col s12 m6">
                  <div className="card-panel  blue accent-1 white-text ">
                    <div className="row">
                      <div className="col s12 m4">
                        <i className="large fas fa-thermometer-half" />
                      </div>
                      <div className="col s12 m8 ">
                        <span className="text-darken-2 ">
                          <span className="card-heading">Temperature</span>
                          <div className="tandh-value">
                            <span>{this.state.temperature}</span>°C
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col s12 m6">
                  <div className="card-panel blue accent-1 white-text">
                    <div className="row">
                      <div className="col s12 m4">
                        <i className="large fas fa-tint" />
                      </div>
                      <div className="col s12 m8 ">
                        <span className="text-darken-2 ">
                          <span className="card-heading">Humidity</span>
                          <div className="tandh-value">
                            <span>{this.state.humidity}</span>%RH
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" center">
              <button
                className="btn-large waves-effect waves-light red lighten-2"
                onClick={this.getTempAndHumid}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
        <br />
        <footer className="page-footer red lighten-2" />
      </Fragment>
    );
  }
}

export default Home;
