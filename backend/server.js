import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/database.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Kết nối MongoDB
connectDB();

// ✅ Model User
const userSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model("User", userSchema);

// ✅ Lấy danh sách users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ Thêm user mới
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  await newUser.save();
  res.status(201).json(newUser);
});

// ✅ Cập nhật user
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật user" });
  }
});

// ✅ Xóa user
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa user" });
  }
});

// ✅ Chạy server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));