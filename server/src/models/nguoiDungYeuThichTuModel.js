const supabase = require('../config/supabase');

const NguoiDungYeuThichTuModel = {
  // 1. READ: Lấy danh sách từ vựng yêu thích của một người dùng cụ thể
  // Tương đương: SELECT * FROM Tu_chuyen_nganh JOIN Nguoi_dung_yeu_thich_tu ...
  getByUser: async (ma_nguoi_dung) => {
    const { data, error } = await supabase
      .from('Nguoi_dung_yeu_thich_tu')
      .select(`
        ma_tu,
        Tu_chuyen_nganh (
          ma_tu,
          chuyen_nganh,
          thuat_ngu_tieng_viet,
          thuat_ngu_tieng_nhat
        )
      `)
      .eq('ma_nguoi_dung', ma_nguoi_dung);
    
    if (error) throw error;
    return data;
  },

  // 2. READ: Kiểm tra xem một người đã thích từ đó chưa (Để hiện nút Like/Unlike)
  checkIsFavorite: async (ma_nguoi_dung, ma_tu) => {
    const { data, error } = await supabase
      .from('Nguoi_dung_yeu_thich_tu')
      .select('*')
      .match({ ma_nguoi_dung, ma_tu })
      .maybeSingle();
    
    if (error) throw error;
    return !!data; // Trả về true nếu đã tồn tại, false nếu chưa
  },

  // 3. CREATE: Thêm quan hệ yêu thích (Like)
  addFavorite: async (ma_nguoi_dung, ma_tu) => {
    const { data, error } = await supabase
      .from('Nguoi_dung_yeu_thich_tu')
      .insert([{ ma_nguoi_dung, ma_tu }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // 4. DELETE: Xóa quan hệ yêu thích (Unlike)
  removeFavorite: async (ma_nguoi_dung, ma_tu) => {
    const { error } = await supabase
      .from('Nguoi_dung_yeu_thich_tu')
      .delete()
      .match({ ma_nguoi_dung, ma_tu });
    
    if (error) throw error;
    return { success: true };
  },

  // 5. AGGREGATE: Đếm xem một từ có bao nhiêu lượt yêu thích
  countFavoritesByWord: async (ma_tu) => {
    const { count, error } = await supabase
      .from('Nguoi_dung_yeu_thich_tu')
      .select('*', { count: 'exact', head: true })
      .eq('ma_tu', ma_tu);
    
    if (error) throw error;
    return count;
  }
};

module.exports = NguoiDungYeuThichTuModel;