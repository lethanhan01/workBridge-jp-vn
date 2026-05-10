const supabase = require('../config/supabase');

const tin_nhan = {
  // 1. READ: Lấy tin nhắn theo cuộc hội thoại (Có phân trang)
  get_by_conversation: async (ma_cuoc_hoi_thoai, limit = 50, offset = 0) => {
    const { data, error } = await supabase
      .from('tin_nhan')
      .select(`
        *,
        nguoi_dung (
          ma_nguoi_dung,
          ten
        )
      `)
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai)
      .order('thoi_gian', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // 2. CREATE: Lưu tin nhắn mới
  create: async (message_data) => {
    const { data, error } = await supabase
      .from('tin_nhan')
      .insert([message_data])
      .select(`
        *,
        nguoi_dung (ten)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 3. UPDATE: Cập nhật trạng thái tin nhắn (Ví dụ: Chuyển từ 'sent' sang 'seen')
  update_status: async (ma_tin_nhan, trang_thai) => {
    const { data, error } = await supabase
      .from('tin_nhan')
      .update({ trang_thai })
      .eq('ma_tin_nhan', ma_tin_nhan)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // 4. DELETE: Xóa tin nhắn (Thu hồi tin nhắn)
  delete: async (ma_tin_nhan, ma_nguoi_gui) => {
    const { error } = await supabase
      .from('tin_nhan')
      .delete()
      .match({ ma_tin_nhan, ma_nguoi_gui });
    
    if (error) throw error;
    return { success: true };
  },

  // 5. READ: Lấy tin nhắn mới nhất của một cuộc hội thoại
  get_latest_message: async (ma_cuoc_hoi_thoai) => {
    const { data, error } = await supabase
      .from('tin_nhan')
      .select('*')
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai)
      .order('thoi_gian', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

module.exports = tin_nhan;