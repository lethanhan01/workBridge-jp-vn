const supabase = require('../config/supabase');

const NguoiDungModel = {
  // 1. READ: Lấy danh sách tất cả người dùng kèm tên vai trò
  getAll: async () => {
    const { data, error } = await supabase
      .from('Nguoi_dung')
      .select('*, Vai_tro(ten_vai_tro)');
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy chi tiết 1 người dùng theo UUID
  getById: async (ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('Nguoi_dung')
      .select('*, Vai_tro(ten_vai_tro)')
      .eq('ma_nguoi_dung', ma_nguoi_dung)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. READ: Tìm người dùng bằng Email hoặc Tên đăng nhập (Dùng cho logic Đăng nhập)
  getByAuthIdentifier: async (identifier) => {
    const { data, error } = await supabase
      .from('Nguoi_dung')
      .select('*')
      .or(`email.eq.${identifier},ten_dang_nhap.eq.${identifier}`)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 4. CREATE: Tạo người dùng mới
  create: async (userData) => {
    const { data, error } = await supabase
      .from('Nguoi_dung')
      .insert([userData])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. UPDATE: Cập nhật thông tin (ví dụ đổi mật khẩu, đổi tên)
  update: async (ma_nguoi_dung, updateData) => {
    const { data, error } = await supabase
      .from('Nguoi_dung')
      .update(updateData)
      .eq('ma_nguoi_dung', ma_nguoi_dung)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 6. DELETE: Xóa tài khoản người dùng
  delete: async (ma_nguoi_dung) => {
    const { error } = await supabase
      .from('Nguoi_dung')
      .delete()
      .eq('ma_nguoi_dung', ma_nguoi_dung);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = NguoiDungModel;