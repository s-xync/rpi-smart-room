import openSocket from "socket.io-client";

const socket = openSocket(process.env.REACT_APP_SERVER_URL);

socket.on("connect", () => {
  console.log(`Cloud socket connected.`);
});

const statusEventListener = callback => {
  socket.on("lightSwitchStatus", lightSwitch => {
    callback(null, lightSwitch);
  });
};

const emitLightSwitchToggle = () => {
  socket.emit("lightSwitchToggle", null);
};

const closeSocket = () => {
  socket.close();
};

export { statusEventListener, emitLightSwitchToggle, closeSocket };
