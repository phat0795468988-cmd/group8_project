const express = require('express');
const { getProfile, updateProfile, authenticateToken } = require('../controllers/profileController');

const router = express.Router();

// Tất cả routes đều cần xác thực
router.use(authenticateToken);

// GET /api/profile - Lấy thông tin profile
router.get('/', getProfile);

// PUT /api/profile - Cập nhật thông tin profile
router.put('/', updateProfile);

// PUT /api/profile/change-password - Đổi mật khẩu
// change-password route removed per request

module.exports = router;




