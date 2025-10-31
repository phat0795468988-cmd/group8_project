// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Khởi tạo ứng dụng Express
const app = express();

// Đọc biến môi trường từ file phù hợp với môi trường
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: `./${envFile}` });

// Fallback to server.env for backward compatibility
if (!process.env.MONGO_URI) {
  dotenv.config({ path: './server.env' });
}

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3001',                    // Local dev frontend
  'http://localhost:3000',                    // Alternative local
  'https://group8-project.onrender.com',      // Backend itself
  process.env.FRONTEND_URL                    // Production frontend URL from env
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions)); // CORS với whitelist
app.use(express.json()); // Đọc JSON từ body request

// Route test kết nối
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running!', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const uploadRouter = require('./routes/upload');

// Use routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/upload', uploadRouter);

// Kết nối MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Thoát process nếu không kết nối được
  }
};

// Khởi tạo kết nối database
connectDB();

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}`);
});
