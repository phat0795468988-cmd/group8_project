const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// Tạo JWT
function signToken(user) {
  const secret = process.env.JWT_SECRET || "your_jwt_secret";
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    secret,
    { expiresIn: "1h" }
  );
}

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đủ thông tin!" });
    }

    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user);

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng điền email và mật khẩu!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng!" });
    }

    const token = signToken(user);
    res.status(200).json({
      message: "Đăng nhập thành công!",
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (tuỳ ứng dụng, với JWT thường phía client tự xoá token)
exports.logout = (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công!" });
};

// Test route
exports.test = (req, res) => {
  res.send("API đang hoạt động!");
};
