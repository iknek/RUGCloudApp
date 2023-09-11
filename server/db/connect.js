// Imports
const { mongoose } = require("mongoose");
require("dotenv").config();

// Environment variables
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbCluster = process.env.DATABASE_CLUSTER;
const dbname = process.env.DATABASE_NAME;

// MongoDB Atlas connection string
const uri = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}.xvtu0la.mongodb.net/${dbname}?retryWrites=true&w=majority`;

// Connect to MongoDB Cloud DataBase (Atlas) and return the database object
const connectDB = async () => {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });
};

// Exports
module.exports = {
  connectDB,
};