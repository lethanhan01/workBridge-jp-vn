const cuocHoiThoai = require('../models/cuocHoiThoai');
const tinNhan = require('../models/tinnhan');
const supabase = require('../config/supabase');

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await cuocHoiThoai.getByUserId(userId);
    res.json(data);
  } catch (err) {
    console.error('Lỗi lấy danh sách hội thoại:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const data = await tinNhan.getByConversationId(roomId);
    res.json(data);
  } catch (err) {
    console.error('Lỗi lấy tin nhắn:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// Lấy danh sách user để chọn khi tạo chat mới
const getUsers = async (req, res) => {
  try {
    const myId = req.user.id;

    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('ma_nguoi_dung, ten, ten_dang_nhap, email, ma_ngon_ngu')
      .neq('ma_nguoi_dung', myId); // loại bản thân ra

    if (error) throw error;
    
    // Xử lý NULL ma_ngon_ngu - mặc định là 'vi' (Tiếng Việt)
    const processedData = data.map(user => ({
      ...user,
      ma_ngon_ngu: user.ma_ngon_ngu || 'vi'
    }));
    
    res.json(processedData);
  } catch (err) {
    console.error('Lỗi lấy danh sách user:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// Tạo cuộc hội thoại mới
const createConversation = async (req, res) => {
  try {
    const myId = req.user.id;
    const { maNguoiDungKia } = req.body; // UUID của người được chọn

    // Tên cuộc hội thoại tự động, frontend có thể hiển thị tên đối phương
    const tenCuocHoiThoai = `Chat_${Date.now()}`;

    const data = await cuocHoiThoai.createWithMembers(tenCuocHoiThoai, [
      myId,
      maNguoiDungKia,
    ]);

    res.status(201).json(data);
  } catch (err) {
    console.error('Lỗi tạo cuộc hội thoại:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

module.exports = { getConversations, getMessages, getUsers, createConversation };