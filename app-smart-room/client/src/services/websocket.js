import openSocket from "socket.io-client";

const socket = openSocket(process.env.REACT_APP_SERVER_URL);

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
