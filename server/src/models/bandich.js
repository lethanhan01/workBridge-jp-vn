const supabase = require('../config/supabase');

const ban_dich = {
  // 1. READ: Lấy bản dịch của một tin nhắn cụ thể
  get_by_message_id: async (ma_tin_nhan) => {
    const { data, error } = await supabase
      .from('ban_dich')
      .select('*')
      .eq('ma_tin_nhan', ma_tin_nhan)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // 2. READ: Lấy bản dịch kèm theo nội dung gốc từ bảng tin_nhan
  get_with_original_message: async (ma_ban_dich) => {
    const { data, error } = await supabase
      .from('ban_dich')
      .select('*, tin_nhan(noi_dung, ma_nguoi_gui)')
      .eq('ma_ban_dich', ma_ban_dich)
      .single();
    if (error) throw error;
    return data;
  },

  // 3. CREATE: Tạo bản dịch mới
  create: async (translation_data) => {
    const { data, error } = await supabase
      .from('ban_dich')
      .insert([translation_data])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 4. UPDATE: Cập nhật bản dịch
  update: async (ma_ban_dich, new_content) => {
    const { data, error } = await supabase
      .from('ban_dich')
      .update({ noi_dung_da_dich: new_content })
      .eq('ma_ban_dich', ma_ban_dich)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 5. DELETE: Xóa bản dịch
  delete: async (ma_ban_dich) => {
    const { error } = await supabase
      .from('ban_dich')
      .delete()
      .eq('ma_ban_dich', ma_ban_dich);
    if (error) throw error;
    return { success: true };
  }
};

module.exports = ban_dich;