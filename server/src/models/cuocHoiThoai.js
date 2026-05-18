const BaseModel = require('./BaseModel');
const supabase = require('../config/supabase');

class CuocHoiThoai extends BaseModel {
  constructor() {
    super('cuoc_hoi_thoai');
  }

  async getByUserId(maNguoiDung) {
    const { data, error } = await supabase
      .from('thanhvienhoithoai')
      .select(`
        ma_cuoc_hoi_thoai,
        cuoc_hoi_thoai (
          ma_cuoc_hoi_thoai,
          ten_cuoc_hoi_thoai,
          ngay_tao
        )
      `)
      .eq('ma_nguoi_dung', maNguoiDung);

    if (error) throw error;
    return data.map((item) => item.cuoc_hoi_thoai);
  }

  async createWithMembers(tenCuocHoiThoai, danhSachMaNguoiDung) {
    // Tạo cuộc hội thoại
    const cuocHoiThoai = await this.create({
      ten_cuoc_hoi_thoai: tenCuocHoiThoai,
    });

    // Thêm tất cả thành viên cùng lúc
    const members = danhSachMaNguoiDung.map((maNguoiDung) => ({
      ma_cuoc_hoi_thoai: cuocHoiThoai.ma_cuoc_hoi_thoai,
      ma_nguoi_dung: maNguoiDung,
      ngay_tham_gia: new Date().toISOString(),
    }));

    const { error } = await supabase.from('thanhvienhoithoai').insert(members);
    if (error) throw error;

    return cuocHoiThoai;
  }
}

module.exports = new CuocHoiThoai();