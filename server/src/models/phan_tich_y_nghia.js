const supabase = require('../config/supabase');

const phan_tich_y_nghia = {
  // 1. READ: Lấy phân tích ý nghĩa của một tin nhắn
  get_by_message_id: async (ma_tin_nhan) => {
    const { data, error } = await supabase
      .from('phan_tich_y_nghia')
      .select('*')
      .eq('ma_tin_nhan', ma_tin_nhan)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy phân tích kèm theo các Gợi ý trả lời (Join 1-N)
  get_with_suggestions: async (ma_tin_nhan) => {
    const { data, error } = await supabase
      .from('phan_tich_y_nghia')
      .select('*, goi_y(*)')
      .eq('ma_tin_nhan', ma_tin_nhan)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 3. CREATE: Lưu kết quả phân tích mới
  create: async (analysis_data) => {
    const { data, error } = await supabase
      .from('phan_tich_y_nghia')
      .insert([analysis_data])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 4. UPDATE: Cập nhật phân tích
  update: async (ma_y_dinh, update_data) => {
    const { data, error } = await supabase
      .from('phan_tich_y_nghia')
      .update(update_data)
      .eq('ma_y_dinh', ma_y_dinh)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. DELETE: Xóa phân tích
  delete: async (ma_y_dinh) => {
    const { error } = await supabase
      .from('phan_tich_y_nghia')
      .delete()
      .eq('ma_y_dinh', ma_y_dinh);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = phan_tich_y_nghia;