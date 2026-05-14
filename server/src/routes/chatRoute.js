const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tất cả các route chat đều cần xác thực
router.use(authMiddleware);

router.get('/conversations', chatController.getConversations);
router.get('/messages/:roomId', chatController.getMessages);

module.exports = router;
