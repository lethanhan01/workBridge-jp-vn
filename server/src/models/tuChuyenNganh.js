const BaseModel = require('./BaseModel');
const supabase = require('../config/supabase');

class TuChuyenNganh extends BaseModel {
  constructor() {
    super('tu_chuyen_nganh');
  }

  async getAll() {
    const { data, error } = await supabase
      .from('tu_chuyen_nganh')
      .select('*, chuyen_nganh(*)');
    if (error) throw error;
    return data;
  }

  async getByChuyenNganh(maChuyenNganh) {
    const { data, error } = await supabase
      .from('tu_chuyen_nganh')
      .select('*, chuyen_nganh(*)')
      .eq('chuyen_nganh', maChuyenNganh);
    if (error) throw error;
    return data;
  }

  // Lấy từ yêu thích của 1 người dùng
  async getYeuThichByUser(maNguoiDung) {
    const { data, error } = await supabase
      .from('nguoi_dung_yeu_thich_tu')
      .select(`
        ma_tu,
        tu_chuyen_nganh (*, chuyen_nganh(*))
      `)
      .eq('ma_nguoi_dung', maNguoiDung);

    if (error) throw error;
    return data.map((item) => item.tu_chuyen_nganh);
  }

  async toggleYeuThich(maNguoiDung, maTu) {
    // Kiểm tra đã yêu thích chưa
    const existing = await supabase
      .from('nguoi_dung_yeu_thich_tu')
      .select('*')
      .eq('ma_nguoi_dung', maNguoiDung)
      .eq('ma_tu', maTu)
      .single();

    if (existing.data) {
      // Đã yêu thích → bỏ yêu thích
      const { error } = await supabase
        .from('nguoi_dung_yeu_thich_tu')
        .delete()
        .eq('ma_nguoi_dung', maNguoiDung)
        .eq('ma_tu', maTu);

      if (error) throw error;
      return { action: 'removed' };
    } else {
      // Chưa yêu thích → thêm vào
      const { error } = await supabase
        .from('nguoi_dung_yeu_thich_tu')
        .insert({ ma_nguoi_dung: maNguoiDung, ma_tu: maTu });

      if (error) throw error;
      return { action: 'added' };
    }
  }
}

module.exports = new TuChuyenNganh();