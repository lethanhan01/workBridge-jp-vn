const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// API lấy danh sách người dùng
router.get('/', userController.getUsers);

module.exports = router;
