const supabase = require('../config/supabase');

const GoiYModel = {
  // 1. READ: Lấy danh sách các gợi ý dựa trên mã ý định (Phân tích ý nghĩa)
  // Sắp xếp theo mức độ phù hợp cao nhất lên đầu
  getByAnalysisId: async (ma_y_dinh) => {
    const { data, error } = await supabase
      .from('Goi_y')
      .select('*')
      .eq('ma_y_dinh', ma_y_dinh)
      .order('muc_do_phu_hop', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy gợi ý tốt nhất (Phù hợp nhất) duy nhất
  getBestSuggestion: async (ma_y_dinh) => {
    const { data, error } = await supabase
      .from('Goi_y')
      .select('*')
      .eq('ma_y_dinh', ma_y_dinh)
      .order('muc_do_phu_hop', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 3. CREATE: Tạo một hoặc nhiều gợi ý mới
  create: async (suggestionData) => {
    // suggestionData: { ma_y_dinh, noi_dung_tieng_viet, noi_dung_tieng_nhat, muc_do_phu_hop }
    const { data, error } = await supabase
      .from('Goi_y')
      .insert(Array.isArray(suggestionData) ? suggestionData : [suggestionData])
      .select();
    if (error) throw error;
    return data;
  },

  // 4. UPDATE: Cập nhật nội dung hoặc mức độ phù hợp của gợi ý
  update: async (ma_goi_y, updateData) => {
    const { data, error } = await supabase
      .from('Goi_y')
      .update(updateData)
      .eq('ma_goi_y', ma_goi_y)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. DELETE: Xóa gợi ý cụ thể
  delete: async (ma_goi_y) => {
    const { error } = await supabase
      .from('Goi_y')
      .delete()
      .eq('ma_goi_y', ma_goi_y);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = GoiYModel;