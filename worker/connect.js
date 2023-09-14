// connect.js
const { mongoose } = require("mongoose");
require("dotenv").config({ path: '../.env' });

const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbCluster = process.env.DATABASE_CLUSTER;
const dbname = process.env.DATABASE_NAME;

const uri = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}.xvtu0la.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return true; // Connection successful
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false; // Connection failed
  }
};

module.exports = {
  connectDB,
};
