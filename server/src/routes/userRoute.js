const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// API lấy danh sách người dùng (Chỉ admin mới được xem)
router.get('/', authMiddleware, adminMiddleware, userController.getUsers);

// API profile (yêu cầu đăng nhập)
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);

// API lấy chi tiết 1 user (chỉ Admin)
router.get('/:id', authMiddleware, adminMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUserAdmin);

// API tạo user mới (chỉ Admin)
router.post('/', authMiddleware, adminMiddleware, userController.createUser);

module.exports = router;
