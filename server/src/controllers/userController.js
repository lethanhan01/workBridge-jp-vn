const supabase = require('../config/supabase');

const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('ma_nguoi_dung, ten, email, ten_dang_nhap');

    if (error) throw error;

    console.log("Dữ liệu người dùng từ DB:", data);
    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy danh sách người dùng:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

module.exports = {
  getUsers
};
