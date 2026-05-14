const BaseModel = require('./BaseModel');

class CuocHoiThoai extends BaseModel {
  constructor() {
    super('cuoc_hoi_thoai');
  }

  /**
   * Lấy danh sách các cuộc hội thoại của một người dùng
   * @param {string} userId - ID người dùng
   * @returns {Promise<Array>}
   */
  async getConversationsByUser(userId) {
    // Join với bảng thanhvienhoithoai để lấy các cuộc hội thoại mà người dùng tham gia
    const { data, error } = await this.supabase
      .from('thanhvienhoithoai')
      .select(`
        ma_cuoc_hoi_thoai,
        cuoc_hoi_thoai (
          ma_cuoc_hoi_thoai,
          ten_cuoc_hoi_thoai,
          ngay_tao
        )
      `)
      .eq('ma_nguoi_dung', userId);

    if (error) throw error;
    
    // Format lại dữ liệu trả về để dễ dùng ở frontend
    return data.map(item => item.cuoc_hoi_thoai);
  }
}

module.exports = new CuocHoiThoai();