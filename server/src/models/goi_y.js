const supabase = require('../config/supabase');

const goi_y = {
  // 1. READ: Lấy danh sách các gợi ý dựa trên mã ý định (Phân tích ý nghĩa)
  // Sắp xếp theo mức độ phù hợp cao nhất lên đầu
  get_by_analysis_id: async (ma_y_dinh) => {
    const { data, error } = await supabase
      .from('goi_y')
      .select('*')
      .eq('ma_y_dinh', ma_y_dinh)
      .order('muc_do_phu_hop', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy gợi ý tốt nhất (Phù hợp nhất) duy nhất
  get_best_suggestion: async (ma_y_dinh) => {
    const { data, error } = await supabase
      .from('goi_y')
      .select('*')
      .eq('ma_y_dinh', ma_y_dinh)
      .order('muc_do_phu_hop', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 3. CREATE: Tạo một hoặc nhiều gợi ý mới
  create: async (suggestion_data) => {
    const { data, error } = await supabase
      .from('goi_y')
      .insert(Array.isArray(suggestion_data) ? suggestion_data : [suggestion_data])
      .select();
    if (error) throw error;
    return data;
  },

  // 4. UPDATE: Cập nhật nội dung hoặc mức độ phù hợp của gợi ý
  update: async (ma_goi_y, update_data) => {
    const { data, error } = await supabase
      .from('goi_y')
      .update(update_data)
      .eq('ma_goi_y', ma_goi_y)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. DELETE: Xóa gợi ý cụ thể
  delete: async (ma_goi_y) => {
    const { error } = await supabase
      .from('goi_y')
      .delete()
      .eq('ma_goi_y', ma_goi_y);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = goi_y;