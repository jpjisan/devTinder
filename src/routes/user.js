const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { connection } = require("mongoose");

const SafeData = "firstName lastName profilePicture about skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const data = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", "firstName lastName profilePicture about skills");

    console.log("Received connection requests:", data);

    res.status(200).send({
      message: "User profile fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error fetching user profile: " + error.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId, status: "accepted" },
        { fromUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("toUserId fromUserId", SafeData)
      .populate("toUserId fromUserId", SafeData);
    const data = connections.map((row) => {
      if (row.fromUserId.equals(loggedInUserId)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: "User connections fetched successfully",
      user: data,
    });
  } catch (error) {
    res.status(400).send("Error fetching user connections: " + error.message);
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10; // Number of users per page
    limit = limit > 30 ? 30 : limit; // Limit to a maximum of 30 users per page
    const skip = (page - 1) * limit; // Calculate the number of users to skip
    const connections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");
    // .populate("toUserId", "firstName")
    // .populate("fromUserId", "firstName");
    // console.log("Connections for user:", connections);
    const hideConnections = new Set();
    connections.forEach((connection) => {
      hideConnections.add(connection.toUserId.toString());
      hideConnections.add(connection.fromUserId.toString());
    });
    // console.log("Hide connections:", hideConnections);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideConnections) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SafeData)
      .skip(skip)
      .limit(limit);
    // console.log("Users for feed:", users);

    res.status(200).json(users);
  } catch (error) {
    res.status(400).send("Error fetching user feed: " + error.message);
  }
});

module.exports = userRouter;
