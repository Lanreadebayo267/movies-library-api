const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);

let database;

const connectDB = async () => {
  try {
    await client.connect();

    database = client.db("movieLibraryDB");

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

const getDB = () => database;

module.exports = {
  connectDB,
  getDB
};