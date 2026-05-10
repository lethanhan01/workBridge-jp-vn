const supabase = require('../config/supabase');

const thanh_vien_hoi_thoai = {
  // 1. CREATE: Thêm thành viên vào cuộc hội thoại (Mời vào nhóm)
  add_member: async (ma_cuoc_hoi_thoai, ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('thanh_vien_hoi_thoai')
      .insert([{ ma_cuoc_hoi_thoai, ma_nguoi_dung }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 2. READ: Lấy danh sách tất cả thành viên trong một cuộc hội thoại
  get_members_by_conversation: async (ma_cuoc_hoi_thoai) => {
    const { data, error } = await supabase
      .from('thanh_vien_hoi_thoai')
      .select('*, nguoi_dung(ma_nguoi_dung, ten, email)')
      .eq('ma_cuoc_hoi_thoai', ma_cuoc_hoi_thoai);
    if (error) throw error;
    return data;
  },

  // 3. READ: Lấy danh sách tất cả cuộc hội thoại mà một người dùng tham gia
  get_conversations_by_user: async (ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('thanh_vien_hoi_thoai')
      .select('*, cuoc_hoi_thoai(*)')
      .eq('ma_nguoi_dung', ma_nguoi_dung)
      .order('ngay_tham_gia', { foreignTable: 'cuoc_hoi_thoai', ascending: false });
    if (error) throw error;
    return data;
  },

  // 4. READ: Kiểm tra xem một người dùng có phải là thành viên của phòng chat không
  check_membership: async (ma_cuoc_hoi_thoai, ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('thanh_vien_hoi_thoai')
      .select('*')
      .match({ ma_cuoc_hoi_thoai, ma_nguoi_dung })
      .maybeSingle();
    if (error) throw error;
    return !!data;
  },

  // 5. DELETE: Xóa thành viên khỏi cuộc hội thoại
  remove_member: async (ma_cuoc_hoi_thoai, ma_nguoi_dung) => {
    const { error } = await supabase
      .from('thanh_vien_hoi_thoai')
      .delete()
      .match({ ma_cuoc_hoi_thoai, ma_nguoi_dung });
    if (error) throw error;
    return { success: true };
  }
};

module.exports = thanh_vien_hoi_thoai;