import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // ✅ Kết nối MongoDB mà không cần các option deprecated
    await mongoose.connect(
      "mongodb+srv://tan221667_db_user:123456Aa@cluster0.ivwudfd.mongodb.net/Cluster0"
    );
    console.log("✅ MongoDB Atlas connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

export default connectDB;