const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

const { dataValidation } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  console.log("Received signup request with data:");

  try {
    /// data validation
    dataValidation(req);

    const {
      firstName,
      lastName,
      emailId,
      age,
      gender,
      password,
      profilePicture,
      about,
      skills,
    } = req.body;
    //password encryption
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully", passwordHash);

    /// create user
    const user = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password: passwordHash,
      profilePicture,
      about,
      skills,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    console.log("Token created successfully:", token);

    //set token to cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
    // console.log(savedUser);
    res.json({ massage: "User created successfully", savedUser });
  } catch (error) {
    console.log("Error saving user:", error);
    res.status(400).send("Error creating user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  console.log("Received login request with data:", req.body);

  try {
    const { emailId, password } = req.body;
    const userData = await User.findOne({ emailId: emailId });
    if (!userData) {
      throw new Error("Invalid email or password");
    }
    const user = {
      _id: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      // emailId: userData.emailId, // Optional - include if needed
      age: userData.age,
      gender: userData.gender,
      profilePicture: userData.profilePicture,
      // interests: userData.interests,
      // Add other non-sensitive fields
      // Exclude: password, resetPasswordToken, etc.
    };
    // check password`
    const isPasswordValid = await userData.validatePassword(password);
    if (isPasswordValid) {
      // create token
      const token = await userData.getJWT();
      console.log("Token created successfully:", token);

      //set token to cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });
      res.status(200).send(user);
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.log("Error in login request:", error);
    res.status(400).send("Error: " + error.message);
  }
});
authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax",
    expires: new Date(0),
  });
  res.send("Logout successful");
});

module.exports = authRouter;
