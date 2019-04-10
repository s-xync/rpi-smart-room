const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 8000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const io = socket(server);

io.on("connection", client => {
  console.log(`Client connected with id ${client.id}`);
});
