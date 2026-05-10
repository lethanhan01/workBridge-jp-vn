const supabase = require('../config/supabase');

const vai_tro = {
  // 1. READ: lấy danh sách tất cả vai trò
  get_all: async () => {
    const { data, error } = await supabase
      .from('vai_tro')
      .select('*')
      .order('ten_vai_tro', { ascending: true });
    if (error) throw error;
    return data;
  },

  // 2. READ: lấy chi tiết một vai trò theo id
  get_by_id: async (id) => {
    const { data, error } = await supabase
      .from('vai_tro')
      .select('*')
      .eq('ma_vai_tro', id)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. READ: tìm kiếm vai trò theo tên (tìm gần đúng)
  search_by_name: async (keyword) => {
    const { data, error } = await supabase
      .from('vai_tro')
      .select('*')
      .ilike('ten_vai_tro', `%${keyword}%`);
    if (error) throw error;
    return data;
  },

  // 4. CREATE: tạo một hoặc nhiều vai trò mới
  create: async (payload) => {
    const { data, error } = await supabase
      .from('vai_tro')
      .insert(Array.isArray(payload) ? payload : [payload])
      .select();
    if (error) throw error;
    return data;
  },

  // 5. UPDATE: cập nhật thông tin vai trò
  update: async (id, update_data) => {
    const { data, error } = await supabase
      .from('vai_tro')
      .update(update_data)
      .eq('ma_vai_tro', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 6. DELETE: xóa vai trò
  delete: async (id) => {
    const { error } = await supabase
      .from('vai_tro')
      .delete()
      .eq('ma_vai_tro', id);
    if (error) throw error;
    return { success: true, message: "xóa vai trò thành công" };
  },

  // 7. RELATION: lấy vai trò kèm danh sách người dùng thuộc vai trò đó
  get_with_users: async (id) => {
    const { data, error } = await supabase
      .from('vai_tro')
      .select('*, nguoi_dung(*)')
      .eq('ma_vai_tro', id)
      .single();
    if (error) throw error;
    return data;
  }
};

module.exports = vai_tro;