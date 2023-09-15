// connect.js
const { mongoose } = require("mongoose");
require("dotenv").config({ path: '../.env' });

const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;

const uri = `mongodb://admin:secret@mongo:27017/mongodb-local?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(connected);
    return true; // Connection successful
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false; // Connection failed  
  }
};

module.exports = {
  connectDB,
};
