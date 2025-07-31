const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const AllowedStatuses = ["ignored", "interested"];
      if (!AllowedStatuses.includes(status)) {
        throw new Error("Invalid status provided");
      }
      const receiver = await User.findById(toUserId);
      if (!receiver) {
        throw new Error("Receiver user not found");
      }
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { toUserId: toUserId, fromUserId: fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });

      if (existingRequest) {
        throw new Error(
          "Connection request already exists between these users"
        );
      }
      const connectionRequest = new ConnectionRequest({
        toUserId: toUserId,
        fromUserId: fromUserId,
        status: status,
      });
      await connectionRequest.save();
      res.status(201).send({
        message: `${req.user.firstName} ${req.user.lastName} ${status} ${receiver.firstName} ${receiver.lastName} successfully`,
        connectionRequest,
      });
    } catch (error) {
      res
        .status(400)
        .send("Error sending connection request: " + error.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { status, requestId } = req.params;
      const AllowedStatuses = ["accepted", "rejected"];
      if (!AllowedStatuses.includes(status)) {
        throw new Error("Invalid status provided");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });
      console.log("connectionRequest:", connectionRequest);

      if (!connectionRequest) {
        throw new Error("Connection request not found or already processed");
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      res.status(200).json({
        message: `Connection request ${status} successfully`,
        connectionRequest,
      });
    } catch (error) {
      res
        .status(400)
        .send("Error reviewing connection request: " + error.message);
    }
  }
);

module.exports = requestRouter;
