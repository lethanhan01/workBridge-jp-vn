var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');

// API Đăng nhập
router.post('/login', authController.login);

// API Đăng ký
router.post('/signup', authController.signup);

module.exports = router;
