// Imports
const mongoose = require("mongoose");
require("dotenv").config({ path: '../.env' });

// Environment variables
const dbUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const dbPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbPort = process.env.MONGO_PORT;

// MongoDB connection string
const uri = `mongodb://${dbUser}:${dbPassword}@my-app-mongodb.default.svc.cluster.local:${dbPort}`;

const connectDB = async () => {
  try {
      await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
  } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
  }
};

// Exports
module.exports = {
  connectDB,
};