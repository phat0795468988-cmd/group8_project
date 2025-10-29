const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware: Xác thực JWT từ header Authorization: Bearer <token>
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]; // hoặc req.get('Authorization')
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Thiếu token hoặc không hợp lệ" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "your_jwt_secret";

    const decoded = jwt.verify(token, secret);

    // Tải thông tin user (tùy chọn) để đảm bảo user còn tồn tại
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user; // gắn user vào request để route phía sau sử dụng
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
