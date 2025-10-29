// Dữ liệu user lưu tạm trong bộ nhớ
let users = [];

// Đăng ký
exports.signup = (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  // Kiểm tra email đã tồn tại chưa
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email đã tồn tại" });
  }

  // Tạo user mới
  const newUser = { id: users.length + 1, username, email, password, role };
  users.push(newUser);

  res.status(201).json({
    message: "Đăng ký thành công",
    user: { id: newUser.id, username: newUser.username, email: newUser.email },
  });
};

// Đăng nhập
exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
  }

  res.json({
    message: "Đăng nhập thành công",
    user: { id: user.id, username: user.username, email: user.email },
  });
};

// Đăng xuất
exports.logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
};
