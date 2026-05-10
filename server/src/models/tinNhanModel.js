const supabase = require('../config/supabase');

const TinNhanModel = {
  // 1. READ: Lấy tin nhắn theo cuộc hội thoại (Có phân trang)
  // Tương đương: SELECT * FROM TinNhan JOIN Nguoi_dung ... ORDER BY time ASC LIMIT 50
  getByConversation: async (ma_cuoc_hoi_thoai, limit = 50, offset = 0) => {
    const { data, error } = await supabase
      .from('TinNhan')
      .select(`
        *,
        Nguoi_dung (
          ma_nguoi_dung,
          ten
        )
      `)
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai)
      .order('time', { ascending: true })
      .range(offset, offset + limit - 1); // Giúp tải tin nhắn dần dần (Infinite Scroll)
    
    if (error) throw error;
    return data;
  },

  // 2. CREATE: Lưu tin nhắn mới
  create: async (messageData) => {
    // messageData: { ma_cuoc_hoi_thoai, ma_nguoi_gui, noi_dung, trang_thai }
    const { data, error } = await supabase
      .from('TinNhan')
      .insert([messageData])
      .select(`
        *,
        Nguoi_dung (ten)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 3. UPDATE: Cập nhật trạng thái tin nhắn (Ví dụ: Chuyển từ 'sent' sang 'seen')
  updateStatus: async (ma_tin_nhan, trang_thai) => {
    const { data, error } = await supabase
      .from('TinNhan')
      .update({ trang_thai })
      .eq('ma_tin_nhan', ma_tin_nhan)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // 4. DELETE: Xóa tin nhắn (Thu hồi tin nhắn)
  delete: async (ma_tin_nhan, ma_nguoi_gui) => {
    // Thêm điều kiện ma_nguoi_gui để đảm bảo chỉ người gửi mới xóa được tin của họ
    const { error } = await supabase
      .from('TinNhan')
      .delete()
      .match({ ma_tin_nhan, ma_nguoi_gui });
    
    if (error) throw error;
    return { success: true };
  },

  // 5. READ: Lấy tin nhắn mới nhất của một cuộc hội thoại (Để hiện ở danh sách chat)
  getLatestMessage: async (ma_cuoc_hoi_thoai) => {
    const { data, error } = await supabase
      .from('TinNhan')
      .select('*')
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai)
      .order('time', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

module.exports = TinNhanModel;