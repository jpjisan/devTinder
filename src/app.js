const express = require("express");
const connectDb = require("./config/dataBase");

const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const http = require("http");
const user = require("./models/user");
const cors = require("cors");
const initializedSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

require("dotenv").config();
const app = express();
// Allow specific origins
const allowedOrigins = [
  "https://devpalace.netlify.app",
  "http://localhost:5173", // For development
];
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
// console.log(process.env);

const server = http.createServer(app);
initializedSocket(server);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, (req, res) => {
      console.log(`Server is running on port ${process.env.PORT || 3000} `);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
