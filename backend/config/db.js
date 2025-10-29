const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Chuỗi kết nối MongoDB Atlas
    const uri = "mongodb+srv://tan221667_db_user:123456Aa@cluster0.ivwudfd.mongodb.net/Cluster0";

    // Kết nối tới MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Thoát chương trình nếu lỗi
  }
};

// Xuất hàm để file server.js có thể gọi
module.exports = connectDB;
