const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const openSocket = require("socket.io-client");

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

let button = {
  status: false
};

let changeableButton;

changeableButton = onChange(button, () => {
  setTimeout(() => {
    // emits event to server on the raspberry pi
    socketCloudToRpiClient.emit("toggleButtonOnOff", {
      buttonStatus: button.status
    });
  }, 0);
});

const io = socket(server);

io.on("connection", client => {
  console.log(`Client connected with id ${client.id}`);

  client.emit("status", {
    buttonStatus: button.status
  });

  client.on("toggleButtonOnOff", () => {
    changeableButton.status = !button.status;
  });
});
