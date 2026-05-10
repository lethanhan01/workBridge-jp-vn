const supabase = require('../config/supabase');

const PhanTichYNghiaModel = {
  // 1. READ: Lấy phân tích ý nghĩa của một tin nhắn
  getByMessageId: async (ma_tin_nhan) => {
    const { data, error } = await supabase
      .from('Phan_tich_y_nghia')
      .select('*')
      .eq('ma_tin_nhan', ma_tin_nhan)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy phân tích kèm theo các Gợi ý trả lời (Join 1-N)
  // Rất hữu ích để hiển thị: "Câu này có ý nghĩa A, bạn nên trả lời theo các cách B, C, D"
  getWithSuggestions: async (ma_tin_nhan) => {
    const { data, error } = await supabase
      .from('Phan_tich_y_nghia')
      .select('*, Goi_y(*)')
      .eq('ma_tin_nhan', ma_tin_nhan)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 3. CREATE: Lưu kết quả phân tích mới
  create: async (analysisData) => {
    // analysisData: { ma_tin_nhan, sac_thai, tom_tat_y_dinh }
    const { data, error } = await supabase
      .from('Phan_tich_y_nghia')
      .insert([analysisData])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 4. UPDATE: Cập nhật phân tích (Nếu AI hoặc người dùng muốn điều chỉnh lại sắc thái)
  update: async (ma_y_dinh, updateData) => {
    const { data, error } = await supabase
      .from('Phan_tich_y_nghia')
      .update(updateData)
      .eq('ma_y_dinh', ma_y_dinh)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. DELETE: Xóa phân tích
  delete: async (ma_y_dinh) => {
    const { error } = await supabase
      .from('Phan_tich_y_nghia')
      .delete()
      .eq('ma_y_dinh', ma_y_dinh);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = PhanTichYNghiaModel;