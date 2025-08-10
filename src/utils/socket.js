const socket = require("socket.io");
const { emit } = require("../models/user");
const initializedSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName, " joined RoomId ", roomId);
      socket.join(roomId);
    });
    socket.on("sendMassge", ({ firstName, userId, targetUserId, message }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName, message);

      io.to(roomId).emit("messageRecived", { firstName, message });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializedSocket;
