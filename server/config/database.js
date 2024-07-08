const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected");
    }catch(err){
        console.error("Failed to connected", err);
    }
};
module.exports = connectDB;
