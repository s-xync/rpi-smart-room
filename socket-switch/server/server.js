const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = socket(server);

var buttonStatus = false;

io.on("connection", client => {
  console.log(`Client connected with id ${client.id}`);
  client.emit("status", {
    buttonStatus
  });
  client.on("toggle", () => {
    buttonStatus = !buttonStatus;
    io.sockets.emit("status", { buttonStatus });
  });
});
