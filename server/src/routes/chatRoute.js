const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/conversations', chatController.getConversations);
router.get('/messages/:roomId', chatController.getMessages);
router.get('/users', chatController.getUsers);              // thêm mới
router.post('/conversations', chatController.createConversation); // thêm mới

module.exports = router;