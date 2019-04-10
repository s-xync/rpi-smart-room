const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const Gpio = require("onoff").Gpio;
const dhtSensorLib = require("node-dht-sensor");

const app = express();

app.use(cors());

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = socket(server);

var buttonStatus = false;

const led = new Gpio(21, "out"); //40th pin

const button = new Gpio(13, "in", "both"); //33rd pin

const dht11Pin = 4; //7th pin

io.on("connection", client => {
  console.log(`Client connected with id ${client.id}`);
  client.emit("status", {
    buttonStatus
  });
  client.on("toggleButtonOnOff", data => {
    console.log(data.buttonStatus);
  });
  client.on("toggle", () => {
    buttonStatus = !buttonStatus;
    led.write(buttonStatus ? 1 : 0, err => {
      io.sockets.emit("status", { buttonStatus });
    });
  });
  button.watch((err, value) => {
    if (value == 1) {
      buttonStatus = !buttonStatus;
      led.write(buttonStatus ? 1 : 0, err => {
        io.sockets.emit("status", { buttonStatus });
      });
    }
  });
});

app.get("/tempandhumid", (req, res) => {
  // 11 --> DHT11 type
  dhtSensorLib.read(11, dht11Pin, (err, temperature, humidity) => {
    if (!err) {
      return res.json({
        success: true,
        message: {
          temperature,
          humidity
        }
      });
    } else {
      return res.json({
        success: false,
        message: "Internal server error"
      });
    }
  });
});

process.on("SIGINT", () => {
  led.unexport();
  button.unexport();
});
