import openSocket from "socket.io-client";

const socket = openSocket("http://10.1.9.141:4000");

const statusEventListener = callback => {
  socket.on("status", data => {
    callback(null, data);
  });
};

const emitToggle = callback => {
  socket.emit("toggle", null);
};

const closeSocket = () => {
  socket.close();
};

export { statusEventListener, emitToggle, closeSocket };
