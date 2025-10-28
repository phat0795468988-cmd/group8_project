const express = require("express");
const router = express.Router();

// Fake user data (bạn có thể thay bằng DB sau này)
const users = [
  { username: "admin", password: "123456" },
  { username: "user", password: "abc123" }
];

// Route: POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem username và password có hợp lệ không
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Thành công
    res.status(200).json({
      message: "Đăng nhập thành công!",
      user: { username: user.username }
    });
  } else {
    // Sai thông tin
    res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu!" });
  }
});

module.exports = router;
