const supabase = require('../config/supabase');

const VaiTroModel = {
  // 1. READ: Lấy danh sách tất cả vai trò
  // Tương đương: SELECT * FROM Vai_tro ORDER BY ten_vai_tro ASC
  getAll: async () => {
    const { data, error } = await supabase
      .from('Vai_tro')
      .select('*')
      .order('ten_vai_tro', { ascending: true });
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy chi tiết một vai trò theo ID
  // Tương đương: SELECT * FROM Vai_tro WHERE ma_vai_tro = id LIMIT 1
  getById: async (id) => {
    const { data, error } = await supabase
      .from('Vai_tro')
      .select('*')
      .eq('ma_vai_tro', id)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. READ: Tìm kiếm vai trò theo tên (Tìm gần đúng)
  // Tương đương: SELECT * FROM Vai_tro WHERE ten_vai_tro ILIKE '%keyword%'
  searchByName: async (keyword) => {
    const { data, error } = await supabase
      .from('Vai_tro')
      .select('*')
      .ilike('ten_vai_tro', `%${keyword}%`);
    if (error) throw error;
    return data;
  },

  // 4. CREATE: Tạo một hoặc nhiều vai trò mới
  // Tương đương: INSERT INTO Vai_tro (ten_vai_tro) VALUES ('...')
  create: async (payload) => {
    // payload có thể là 1 object {ten_vai_tro: 'Admin'} 
    // hoặc 1 mảng [{ten_vai_tro: 'A'}, {ten_vai_tro: 'B'}]
    const { data, error } = await supabase
      .from('Vai_tro')
      .insert(Array.isArray(payload) ? payload : [payload])
      .select();
    if (error) throw error;
    return data;
  },

  // 5. UPDATE: Cập nhật thông tin vai trò
  // Tương đương: UPDATE Vai_tro SET ten_vai_tro = '...' WHERE ma_vai_tro = id
  update: async (id, updateData) => {
    const { data, error } = await supabase
      .from('Vai_tro')
      .update(updateData)
      .eq('ma_vai_tro', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 6. DELETE: Xóa vai trò
  // Tương đương: DELETE FROM Vai_tro WHERE ma_vai_tro = id
  delete: async (id) => {
    const { error } = await supabase
      .from('Vai_tro')
      .delete()
      .eq('ma_vai_tro', id);
    if (error) throw error;
    return { success: true, message: "Xóa vai trò thành công" };
  },

  // 7. RELATION: Lấy vai trò kèm danh sách người dùng thuộc vai trò đó
  // Tương đương: Một lệnh JOIN phức tạp giữa Vai_tro và Nguoi_dung
  getWithUsers: async (id) => {
    const { data, error } = await supabase
      .from('Vai_tro')
      .select('*, Nguoi_dung(*)')
      .eq('ma_vai_tro', id)
      .single();
    if (error) throw error;
    return data;
  }
};

module.exports = VaiTroModel;