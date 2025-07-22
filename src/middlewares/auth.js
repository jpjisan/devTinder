const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send("No token provided");
  }
  try {
    const decodedObj = await jwt.verify(token, "devTinder69");
    const { _id } = decodedObj;
    // console.log("Decoded user ID from token:", _id);

    const user = await User.findById(_id);
    // console.log(user);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log("Authentication error:", error);

    res.status(400).send("Authentication failed: " + error.message);
  }
};
module.exports = userAuth;
