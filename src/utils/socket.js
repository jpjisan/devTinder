const socket = require("socket.io");
const initializedSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", () => {});
    socket.on("sendMassge", () => {});
    socket.on("sdisconnect", () => {});
  });
};

module.exports = initializedSocket;
