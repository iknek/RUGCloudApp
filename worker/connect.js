// connect.js
const { mongoose } = require("mongoose");
require("dotenv").config({ path: '../.env' });

const dbUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const dbPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbPort = process.env.MONGO_PORT;

const uri = `mongodb://${dbUser}:${dbPassword}@mongo:${dbPort}/mongodb-local?authSource=${dbUser}`;

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
