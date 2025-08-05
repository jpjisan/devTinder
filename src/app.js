const express = require("express");
const connectDb = require("./config/dataBase");

const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const user = require("./models/user");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// console.log(process.env);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
// app.use("/", Router);
//
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   console.log("Fetching user with email:", userEmail);

//   try {
//     const user = await User.findOne({
//       emailId: userEmail,
//     });
//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (error) {
//     console.log("Error fetching user:", error);
//   }
// });
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (users) {
//       res.status(200).json(users);
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (error) {
//     console.log("Error fetching user:", error);
//   }
// });
// app.delete("/user", async (req, res) => {
//   // console.log(req.body);

//   const userId = req.body.userId;
//   console.log(userId);

//   try {
//     const user = await User.findByIdAndDelete(userId);
//     res.status(200).json("User deleted succesfully");
//   } catch (error) {
//     console.log("Error fetching user:", error);
//   }
// });
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   console.log(userId);
//   console.log("Updating user with data:", data);

//   try {
//     const ALLOWED_FIELDS = [
//       "firstName",
//       "lastName",
//       "age",
//       "about",
//       "profilePicture",
//       "skills",
//     ];

//     const isUpdateAllowed = Object.keys(data).every((key) =>
//       ALLOWED_FIELDS.includes(key)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Invalid update fields");
//     }
//     if (data.skills?.length > 10) {
//       throw new Error("Skills array cannot exceed 10 items");
//     }
//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     console.log("user updated:", user);

//     res.status(200).json("User updated succesfully");
//   } catch (error) {
//     console.log("Error fetching user:", error);
//     res.status(400).send("Error updating user: " + error.message);
//   }
// });

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, (req, res) => {
      console.log(`Server is running on port ${process.env.PORT} `);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
