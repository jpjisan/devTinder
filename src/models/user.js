const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLenth: 50,
      capitalize: true,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
      capitalize: true,
    },
    emailId: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 16,
      max: 100,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("No gender data found");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // validate(value) {
      //   if (validator.isStrongPassword(value)) {
      //     throw new Error("Password must be strong");
      //   }
      // },
    },
    about: {
      type: String,
      default: "Hello, I am using DevTinder!",
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL for profile picture");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  console.log("hasedPass", passwordHash);

  const isValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isValid;
};

module.exports = mongoose.model("User", userSchema);
