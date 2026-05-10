const supabase = require('../config/supabase');

const nguoi_dung = {
  // 1. READ: Lấy danh sách tất cả người dùng kèm tên vai trò
  get_all: async () => {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('*, vai_tro(ten_vai_tro)');
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy chi tiết 1 người dùng theo UUID
  get_by_id: async (ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('*, vai_tro(ten_vai_tro)')
      .eq('ma_nguoi_dung', ma_nguoi_dung)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. READ: Tìm người dùng bằng Email hoặc Tên đăng nhập
  get_by_auth_identifier: async (identifier) => {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('*')
      .or(`email.eq.${identifier},ten_dang_nhap.eq.${identifier}`)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 4. CREATE: Tạo người dùng mới
  create: async (user_data) => {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .insert([user_data])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. UPDATE: Cập nhật thông tin
  update: async (ma_nguoi_dung, update_data) => {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .update(update_data)
      .eq('ma_nguoi_dung', ma_nguoi_dung)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 6. DELETE: Xóa tài khoản người dùng
  delete: async (ma_nguoi_dung) => {
    const { error } = await supabase
      .from('nguoi_dung')
      .delete()
      .eq('ma_nguoi_dung', ma_nguoi_dung);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = nguoi_dung;