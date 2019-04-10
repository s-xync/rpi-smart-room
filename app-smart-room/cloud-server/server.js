const express = require("express");
const socket = require("socket.io");
const openSocket = require("socket.io-client");
const cors = require("cors");
const request = require("request");

require("dotenv").config({ path: __dirname + "/.env.local" });

const app = express();

app.use(cors());

const PORT = 8000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// lets us hear changes on an object
// https://davidwalsh.name/watch-object-changes

// starts
const onChange = (object, onChange) => {
  const handler = {
    get(target, property, receiver) {
      try {
        return new Proxy(target[property], handler);
      } catch (err) {
        return Reflect.get(target, property, receiver);
      }
    },
    defineProperty(target, property, descriptor) {
      onChange();
      return Reflect.defineProperty(target, property, descriptor);
    },
    deleteProperty(target, property) {
      onChange();
      return Reflect.deleteProperty(target, property);
    }
  };

  return new Proxy(object, handler);
};
// ends

const socketCloudToRpiClient = openSocket(process.env.RPI_SERVER_URL);

let lightSwitch = {
  status: false
};

let changeableLightSwitch;

socketCloudToRpiClient.on("connect", () => {
  socketCloudToRpiClient.emit("lightSwitchStatus", lightSwitch);
});

changeableLightSwitch = onChange(lightSwitch, () => {
  setTimeout(() => {
    // emits event to server on the raspberry pi
    socketCloudToRpiClient.emit("lightSwitchStatus", lightSwitch);
  }, 0);
});

const io = socket(server);

io.on("connection", client => {
  console.log(`Browser client connected with id ${client.id}`);

  client.emit("lightSwitchStatus", lightSwitch);

  client.on("lightSwitchToggle", () => {
    // changing changeableLightSwitch will trigger events using the onChange utility
    changeableLightSwitch.status = !lightSwitch.status;
  });

  socketCloudToRpiClient.on("lightSwitchStatus", lightSwitch => {
    io.sockets.emit("lightSwitchStatus", lightSwitch);
  });
});

app.get("/tempandhumid", (req, res) => {
  request(
    process.env.RPI_SERVER_URL + "/tempandhumid",
    (err, response, body) => {
      if (!err) {
        return res.send(body);
      } else {
        return res.json({
          success: false,
          message: "Internal server error"
        });
      }
    }
  );
});
