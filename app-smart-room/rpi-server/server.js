const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const Gpio = require("onoff").Gpio;
const dhtSensorLib = require("node-dht-sensor");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = socket(server);

let lightSwitchStatus = false;
let lightSwitchAutomatic = false;
let pirSensorInterval;

const led = new Gpio(21, "out"); //40th pin

const lightSwitchButton = new Gpio(13, "in", "both"); //33rd pin

const dht11Pin = 4; //7th pin

const pirSensor = new Gpio(5, "in"); //29th pin

io.on("connection", client => {
  console.log(`Cloud client connected with id ${client.id}`);

  client.on("lightSwitchStatus", lightSwitch => {
    lightSwitchStatus = lightSwitch.status;
    lightSwitchAutomatic = lightSwitch.automatic;
    led.write(lightSwitch.status ? 1 : 0, err => {
      io.sockets.emit("lightSwitchStatus", lightSwitch);
    });
  });

  lightSwitchButton.watch((err, value) => {
    if (value == 1) {
      lightSwitchAutomatic = false;
      lightSwitchStatus = !lightSwitchStatus;
      led.write(lightSwitchStatus ? 1 : 0, err => {
        io.sockets.emit("lightSwitchStatus", {
          status: lightSwitchStatus,
          automatic: lightSwitchAutomatic
        });
      });
    }
  });

  pirSensorInterval = setInterval(() => {
    if (lightSwitchAutomatic) {
      const presence = pirSensor.readSync();
      lightSwitchStatus = presence == 0 ? false : true;
      led.write(lightSwitchStatus ? 1 : 0, err => {
        io.sockets.emit("lightSwitchStatus", {
          status: lightSwitchStatus,
          automatic: lightSwitchAutomatic
        });
      });
    }
  }, 1000);
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
  clearInterval(pirSensorInterval);
  led.writeSync(0);
  led.unexport();
  lightSwitchButton.unexport();
});
