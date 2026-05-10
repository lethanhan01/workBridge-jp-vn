const supabase = require('../config/supabase');

const tu_chuyen_nganh = {
  // 1. READ: Lấy toàn bộ danh sách từ vựng (Sắp xếp theo chuyên ngành)
  get_all: async () => {
    const { data, error } = await supabase
      .from('tu_chuyen_nganh')
      .select('*')
      .order('chuyen_nganh', { ascending: true });
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy chi tiết một từ theo ID
  get_by_id: async (ma_tu) => {
    const { data, error } = await supabase
      .from('tu_chuyen_nganh')
      .select('*')
      .eq('ma_tu', ma_tu)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. READ: Tìm kiếm nâng cao (Tìm trong Chuyên ngành, Tiếng Việt hoặc Tiếng Nhật)
  search: async (query) => {
    const { data, error } = await supabase
      .from('tu_chuyen_nganh')
      .select('*')
      .or(`chuyen_nganh.ilike.%${query}%,thuat_ngu_tieng_viet.ilike.%${query}%,thuat_ngu_tieng_nhat.ilike.%${query}%`);
    if (error) throw error;
    return data;
  },

  // 4. CREATE: Thêm một hoặc nhiều từ mới
  create: async (word_data) => {
    const { data, error } = await supabase
      .from('tu_chuyen_nganh')
      .insert(Array.isArray(word_data) ? word_data : [word_data])
      .select();
    if (error) throw error;
    return data;
  },

  // 5. UPDATE: Cập nhật thông tin từ vựng
  update: async (ma_tu, update_data) => {
    const { data, error } = await supabase
      .from('tu_chuyen_nganh')
      .update(update_data)
      .eq('ma_tu', ma_tu)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 6. DELETE: Xóa từ vựng khỏi hệ thống
  delete: async (ma_tu) => {
    const { error } = await supabase
      .from('tu_chuyen_nganh')
      .delete()
      .eq('ma_tu', ma_tu);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = tu_chuyen_nganh;