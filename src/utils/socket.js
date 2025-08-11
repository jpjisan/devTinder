const socket = require("socket.io");
const { emit } = require("../models/user");
const Chat = require("../models/chat");
const allowedOrigins = [
  "https://devpalace.netlify.app",
  "http://localhost:5173", // For development
];
const initializedSocket = (server) => {
  const io = socket(server, {
    cors: {
      // origin: "http://localhost:5173",
      // origin: "https://devpalace.netlify.app",
      origin: "http://localhost:5173",
    },
  });

  const onlineUsers = new Map(); // Track online users

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);

      console.log(firstName, " joined RoomId ", roomId);
      socket.join(roomId);

      // Notify target user that this user is online
      socket.to(roomId).emit("user-online", { userId });
    });

    socket.on("user-typing", ({ targetUserId }) => {
      const roomId = [socket.userId, targetUserId].sort().join("_");
      socket.to(roomId).emit("user-typing", { userId: socket.userId });
    });

    socket.on("user-stopped-typing", ({ targetUserId }) => {
      const roomId = [socket.userId, targetUserId].sort().join("_");
      socket.to(roomId).emit("user-stopped-typing", { userId: socket.userId });
    });

    socket.on("message-read", ({ messageId, targetUserId }) => {
      const roomId = [socket.userId, targetUserId].sort().join("_");
      socket.to(roomId).emit("message-read", { messageId });
    });
    socket.on(
      "sendMassge",
      async ({ firstName, userId, targetUserId, message }) => {
        const roomId = [userId, targetUserId].sort().join("_");
        console.log(firstName, message);
        // store msg to db
        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            let chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            reciverId: targetUserId,
            text: message.text,
            status: message.status,
          });
          const savedmsg = await chat.save();
          const size = savedmsg.messages.length;
          // savedmsg is full array of a all msg that why last append msg is shown
          const lastmsg = savedmsg.messages[size - 1];
          console.log(lastmsg);

          io.to(roomId).emit("messageRecived", { firstName, lastmsg });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        // Notify all rooms this user was in that they're offline
        socket.broadcast.emit("user-offline", {
          userId: socket.userId,
          lastSeen: new Date(),
        });
      }
    });
  });
};

module.exports = initializedSocket;
