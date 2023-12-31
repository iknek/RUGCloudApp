require("dotenv").config({ path: '../.env' });
// Imports
const mongoose = require("mongoose");
// Environment variables
const dbUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const dbPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbPort = process.env.MONGO_PORT;

// MongoDB connection string
const uri = `mongodb://${dbUser}:${dbPassword}@my-mongodb.default.svc.cluster.local:${dbPort}`;

const connectDB = async () => {
  try {
      await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
  } catch (error) {
      console.error("MongoDB connection error:", error);
      console.log("here?? why in connect?");
      connectDB();
  }
};

// Exports
module.exports = {
  connectDB,
};