const BaseModel = require('./BaseModel');

class ThanhVien extends BaseModel {
  constructor() {
    super('thanhvienhoithoai');
  }

  async addMember(maCuocHoiThoai, maNguoiDung) {
    return await this.create({
      ma_cuoc_hoi_thoai: maCuocHoiThoai,
      ma_nguoi_dung: maNguoiDung,
      ngay_tham_gia: new Date().toISOString(),
    });
  }

  async getMembers(maCuocHoiThoai) {
    return await this.findAll({ ma_cuoc_hoi_thoai: maCuocHoiThoai });
  }
}

module.exports = new ThanhVien();