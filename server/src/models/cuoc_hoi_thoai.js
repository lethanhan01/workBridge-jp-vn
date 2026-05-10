const supabase = require('../config/supabase');

const cuoc_hoi_thoai = {
  // 1. READ: Lấy toàn bộ danh sách cuộc hội thoại (Mới nhất lên đầu)
  get_all: async () => {
    const { data, error } = await supabase
      .from('cuoc_hoi_thoai')
      .select('*')
      .order('ngay_tao', { ascending: false });
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy chi tiết một cuộc hội thoại theo ID
  get_by_id: async (ma_cuoc_hoi_thoai) => {
    const { data, error } = await supabase
      .from('cuoc_hoi_thoai')
      .select('*')
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. READ: Tìm kiếm cuộc hội thoại theo tên
  search_by_name: async (name) => {
    const { data, error } = await supabase
      .from('cuoc_hoi_thoai')
      .select('*')
      .ilike('ten_cuoc_hoi_thoai', `%${name}%`);
    if (error) throw error;
    return data;
  },

  // 4. CREATE: Tạo cuộc hội thoại mới
  create: async (conversation_data) => {
    const { data, error } = await supabase
      .from('cuoc_hoi_thoai')
      .insert([conversation_data])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. UPDATE: Đổi tên cuộc hội thoại
  update: async (ma_cuoc_hoi_thoai, update_data) => {
    const { data, error } = await supabase
      .from('cuoc_hoi_thoai')
      .update(update_data)
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 6. DELETE: Xóa cuộc hội thoại
  delete: async (ma_cuoc_hoi_thoai) => {
    const { error } = await supabase
      .from('cuoc_hoi_thoai')
      .delete()
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = cuoc_hoi_thoai;