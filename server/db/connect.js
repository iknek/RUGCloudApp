// Imports
const mongoose = require("mongoose");
require("dotenv").config({ path: '../.env' });

// Environment variables
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbCluster = process.env.DATABASE_CLUSTER;
const dbname = process.env.DATABASE_NAME;

// MongoDB connection string
const uri = `mongodb://admin:secret@mongo:27017/mongodb-local?authSource=admin`;

// Connect to MongoDB Cloud DataBase (Atlas) and return the database object
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