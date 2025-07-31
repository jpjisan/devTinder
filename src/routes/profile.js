const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { model } = require("mongoose");
const { validateEditProfile } = require("../utils/validation");
const { validatePassword } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // console.log("Fetching user profile...", user._id);
    // const isPasswordValid = await user.vali;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error fetching profile: " + error.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfile(req);
    if (!validateEditProfile(req)) {
      throw new Error("Invalid fields in profile edit request");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    console.log("Profile updated successfully", user);
    res.json(user);
  } catch (error) {
    res.status(400).json("Error " + error.message);
  }
});
profileRouter.patch("/profile/change-password", userAuth, async (req, res) => {
  const user = req.user;
  // const hashedPassword = user.password;
  const isPasswordValid = await user.validatePassword(req.body.password);
  console.log(req.body.password);

  try {
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const newPassword = req.body.newPassword;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Password changed successfully");
  } catch (error) {
    res.status(400).send("Error changing password: " + error.message);
  }
});
module.exports = profileRouter;
