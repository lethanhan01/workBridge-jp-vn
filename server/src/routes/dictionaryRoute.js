const express = require('express');
const router = express.Router();
const dictionaryController = require('../controllers/dictionaryController');
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/', authMiddleware, dictionaryController.getAllDictionary);

// Toggle trạng thái yêu thích
router.post('/favorites/:id/toggle', authMiddleware, dictionaryController.toggleFavorite);

module.exports = router;
