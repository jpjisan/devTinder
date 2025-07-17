const mongoose = require('mongoose');

const connectDb = async ()=>{
   await mongoose.connect('mongodb+srv://JpJisan:aVDQz6jAy95HIcHQ@namastenode.6m6cg7w.mongodb.net/devTinder')
}


module.exports = connectDb;