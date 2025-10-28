const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");

// Sử dụng routes
app.use("/api/auth", authRoutes);

// Route test mặc định
app.get("/", (req, res) => {
  res.send(`
    <h1>Backend-Auth API</h1>
    <p>Server đang chạy!</p>
    <p>Thử đăng nhập bằng Postman hoặc fetch:</p>
    <code>POST /api/auth/login</code>
  `);
});

// Chạy server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
