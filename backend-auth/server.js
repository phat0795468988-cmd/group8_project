const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 👇 Cực kỳ quan trọng: middleware để đọc JSON body
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("Backend-Auth API is running...");
});

// Chạy server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
