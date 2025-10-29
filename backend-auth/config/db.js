const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://tan221667_db_user:123456Aa@cluster0.ivwudfd.mongodb.net/?appName=Cluster0");
    console.log("✅ Kết nối MongoDB Atlas thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
