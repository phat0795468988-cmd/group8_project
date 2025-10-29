const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = "mongodb+srv://tan221667_db_user:123456Aa@cluster0.ivwudfd.mongodb.net/Cluster0";

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
