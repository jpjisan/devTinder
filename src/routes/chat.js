const express = require("express");
const userAuth = require("../middlewares/auth");
const Chat = require("../models/chat");
const User = require("../models/user");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const user = req.user;
  try {
    const { targetUserId } = req.params;
    const targetUser = await User.findById(targetUserId).select(
      "firstName lastName profilePicture"
    );
    console.log(targetUser);

    const chat = await Chat.findOne({
      participants: { $all: [user._id, targetUserId] },
    });
    //   .populate({
    //     path: "messages.senderId",
    //     select: "firstName lastName profilePicture",
    //   })
    //   .populate({
    //     path: "messages.reciverId",
    //     select: "firstName lastName profilePicture",
    //   });
    if (!chat) {
      let chat = new Chat({
        participants: [user._id, targetUserId],
        messages: [],
      });
      let savedChat = await chat.save();
      res.json({ targetUser, chat });
      return;
    }
    res.json({ targetUser, chat });
  } catch (error) {
    console.log(error);
  }
});

module.exports = chatRouter;
