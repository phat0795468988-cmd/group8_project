const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// ===== Tạo Schema User =====
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ===== Controller Functions =====

// Đăng ký
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra thiếu dữ liệu
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin đăng ký." });
    }

    // Kiểm tra trùng email
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại." });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu." });

    res.json({ message: "Đăng nhập thành công!", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng xuất (giả lập)
exports.logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công!" });
};
