const express = require("express");
const connectDb =require('./config/dataBase')
const User = require('./models/user');
const app = express();

app.post("/signup", async (req,res)=>{

    const user = new User({
        firstName: 'avik',
        lastName: 'patra',
        emailId: "patra@gmail",
        gender:'male',
        password: '12345kjnj6',
    });
    await user.save();
    console.log(user);
    

    res.send('User created successfully' );

})






connectDb().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");

});
}).catch(err => {
    console.error("Database connection failed:", err);
});

