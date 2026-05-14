const cuocHoiThoai = require('../models/cuoc_hoi_thoai');
const tinNhan = require('../models/tinnhan');

/**
 * Lấy danh sách các cuộc hội thoại của người dùng hiện tại
 */
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await cuocHoiThoai.getConversationsByUser(userId);
    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy danh sách hội thoại:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

/**
 * Lấy lịch sử tin nhắn của một cuộc hội thoại
 */
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const data = await tinNhan.getByConversationId(roomId);
    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy tin nhắn:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

module.exports = {
  getConversations,
  getMessages
};
