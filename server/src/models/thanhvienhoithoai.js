const BaseModel = require('./BaseModel');

class ThanhVien extends BaseModel {
  constructor() {
    super('thanhvienhoithoai');
  }

  /**
   * Thêm thành viên vào cuộc hội thoại
   * @param {string} conversationId 
   * @param {string} userId 
   */
  async addMember(conversationId, userId) {
    return await this.create({
      ma_cuoc_hoi_thoai: conversationId,
      ma_nguoi_dung: userId,
      ngay_tham_gia: new Date().toISOString()
    });
  }
}

module.exports = new ThanhVien();