const express = require("express");
const app = express();

// app.use("/",(req, res, next) => {
//     res.send('Hello World!');
// })
app.use("/hello", (req, res, next) => {
    res.send("Hello from server!");
});
app.use("/test", (req, res, next) => {
    res.send("testing the route");
});
app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");
});
