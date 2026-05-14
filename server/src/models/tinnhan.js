const BaseModel = require('./BaseModel');

class TinNhan extends BaseModel {
  constructor() {
    super('tinnhan');
  }

  /**
   * Lấy lịch sử tin nhắn của một cuộc hội thoại
   * @param {string} conversationId - ID cuộc hội thoại
   * @returns {Promise<Array>}
   */
  async getByConversationId(conversationId) {
    return await this.findAll({ ma_cuoc_hoi_thoai: conversationId });
  }

  /**
   * Lưu tin nhắn mới
   * @param {Object} messageData - Dữ liệu tin nhắn (ma_nguoi_gui, ma_cuoc_hoi_thoai, noi_dung)
   * @returns {Promise<Object>}
   */
  async sendMessage(messageData) {
    return await this.create({
      ...messageData,
      time: new Date().toISOString(),
      trang_thai: 'sent'
    });
  }
}

module.exports = new TinNhan();