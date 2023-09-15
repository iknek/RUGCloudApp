// connect.js
const { mongoose } = require("mongoose");
require("dotenv").config({ path: '../.env' });

const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;

const uri = `mongodb://${dbUser}:${dbPassword}@mongo:27017/mongodb-local`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    return true; // Connection successful
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false; // Connection failed
  }
};

module.exports = {
  connectDB,
};
