const supabase = require('../config/supabase');

const BanDichModel = {
  // 1. READ: Lấy bản dịch của một tin nhắn cụ thể
  getByMessageId: async (ma_tin_nhan) => {
    const { data, error } = await supabase
      .from('BanDich')
      .select('*')
      .eq('ma_tin_nhan', ma_tin_nhan)
      .maybeSingle(); // Dùng maybeSingle để tránh báo lỗi nếu tin nhắn chưa kịp dịch
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy bản dịch kèm theo nội dung gốc từ bảng TinNhan
  // Tương đương: SELECT * FROM BanDich JOIN TinNhan ...
  getWithOriginalMessage: async (ma_ban_dich) => {
    const { data, error } = await supabase
      .from('BanDich')
      .select('*, TinNhan(noi_dung, ma_nguoi_gui)')
      .eq('ma_ban_dich', ma_ban_dich)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. CREATE: Tạo bản dịch mới
  create: async (translationData) => {
    // translationData: { ma_tin_nhan, noidungoc, noi_dung_da_dich }
    const { data, error } = await supabase
      .from('BanDich')
      .insert([translationData])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 4. UPDATE: Cập nhật bản dịch (Dùng khi người dùng muốn sửa lại bản dịch cho chuẩn hơn)
  update: async (ma_ban_dich, newContent) => {
    const { data, error } = await supabase
      .from('BanDich')
      .update({ noi_dung_da_dich: newContent })
      .eq('ma_ban_dich', ma_ban_dich)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. DELETE: Xóa bản dịch
  delete: async (ma_ban_dich) => {
    const { error } = await supabase
      .from('BanDich')
      .delete()
      .eq('ma_ban_dich', ma_ban_dich);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = BanDichModel;