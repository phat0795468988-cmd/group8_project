const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Mỗi route phải gọi đến 1 hàm cụ thể trong controller
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
