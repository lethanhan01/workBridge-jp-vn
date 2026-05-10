const supabase = require('../../config/supabase');

const RoleModel = {
  // Lấy danh sách tất cả vai trò
  getAll: async () => {
    const { data, error } = await supabase.from('Vai_tro').select('*');
    if (error) throw error;
    return data;
  },

  // Tạo vai trò mới
  create: async (ten_vai_tro) => {
    const { data, error } = await supabase
      .from('Vai_tro')
      .insert([{ ten_vai_tro }])
      .select();
    if (error) throw error;
    return data[0];
  }
};

module.exports = RoleModel;