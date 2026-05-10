const supabase = require('../config/supabase');

const ThanhVienHoiThoaiModel = {
  // 1. CREATE: Thêm thành viên vào cuộc hội thoại (Mời vào nhóm)
  addMember: async (ma_cuoc_hoi_thoai, ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('ThanhVienHoiThoai')
      .insert([{ ma_cuoc_hoi_thoai, ma_nguoi_dung }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 2. READ: Lấy danh sách tất cả thành viên trong một cuộc hội thoại
  // Kèm theo thông tin chi tiết của từng người từ bảng Nguoi_dung
  getMembersByConversation: async (ma_cuoc_hoi_thoai) => {
    const { data, error } = await supabase
      .from('ThanhVienHoiThoai')
      .select('*, Nguoi_dung(ma_nguoi_dung, ten, email)')
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai);
    if (error) throw error;
    return data;
  },

  // 3. READ: Lấy danh sách tất cả cuộc hội thoại mà một người dùng tham gia
  // Tương đương: SELECT * FROM Cuoc_Hoi_Thoai JOIN ThanhVienHoiThoai ...
  getConversationsByUser: async (ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('ThanhVienHoiThoai')
      .select('*, Cuoc_Hoi_Thoai(*)')
      .eq('ma_nguoi_dung', ma_nguoi_dung)
      .order('ngay_tham_gia', { foreignTable: 'Cuoc_Hoi_Thoai', ascending: false });
    if (error) throw error;
    return data;
  },

  // 4. READ: Kiểm tra xem một người dùng có phải là thành viên của phòng chat không
  // Dùng để chặn người lạ đọc trộm tin nhắn
  checkMembership: async (ma_cuoc_hoi_thoai, ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('ThanhVienHoiThoai')
      .select('*')
      .match({ ma_cuoc_hoi_thoai, ma_nguoi_dung })
      .maybeSingle();
    if (error) throw error;
    return !!data; // Trả về true nếu là thành viên, false nếu không phải
  },

  // 5. DELETE: Xóa thành viên khỏi cuộc hội thoại (Rời nhóm hoặc bị mời ra)
  removeMember: async (ma_cuoc_hoi_thoai, ma_nguoi_dung) => {
    const { error } = await supabase
      .from('ThanhVienHoiThoai')
      .delete()
      .match({ ma_cuoc_hoi_thoai, ma_nguoi_dung });
    if (error) throw error;
    return { success: true };
  }
};

module.exports = ThanhVienHoiThoaiModel;