const supabase = require('../config/supabase');

const CuocHoiThoaiModel = {
  // 1. READ: Lấy toàn bộ danh sách cuộc hội thoại (Mới nhất lên đầu)
  // Tương đương: SELECT * FROM Cuoc_Hoi_Thoai ORDER BY ngay_tao DESC
  getAll: async () => {
    const { data, error } = await supabase
      .from('Cuoc_Hoi_Thoai')
      .select('*')
      .order('ngay_tao', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy chi tiết một cuộc hội thoại theo ID
  getById: async (ma_cuoc_hoi_thoai) => {
    const { data, error } = await supabase
      .from('Cuoc_Hoi_Thoai')
      .select('*')
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. READ: Tìm kiếm cuộc hội thoại theo tên
  // Tương đương: WHERE ten_cuoc_hoi_thoai ILIKE '%...%'
  searchByName: async (name) => {
    const { data, error } = await supabase
      .from('Cuoc_Hoi_Thoai')
      .select('*')
      .ilike('ten_cuoc_hoi_thoai', `%${name}%`);
    if (error) throw error;
    return data;
  },

  // 4. CREATE: Tạo cuộc hội thoại mới
  create: async (conversationData) => {
    // conversationData: { ten_cuoc_hoi_thoai }
    const { data, error } = await supabase
      .from('Cuoc_Hoi_Thoai')
      .insert([conversationData])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. UPDATE: Đổi tên cuộc hội thoại
  update: async (ma_cuoc_hoi_thoai, updateData) => {
    const { data, error } = await supabase
      .from('Cuoc_Hoi_Thoai')
      .update(updateData)
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 6. DELETE: Xóa cuộc hội thoại (Sẽ tự động xóa tin nhắn nhờ ON DELETE CASCADE trong DB)
  delete: async (ma_cuoc_hoi_thoai) => {
    const { error } = await supabase
      .from('Cuoc_Hoi_Thoai')
      .delete()
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = CuocHoiThoaiModel;