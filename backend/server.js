const express = require("express");
const connectDB = require("./config/db.js");


const app = express();
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Import routes
const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

// Route test mặc định
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
