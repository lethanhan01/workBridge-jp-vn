const BaseModel = require('./BaseModel');

class NguoiDung extends BaseModel {
  constructor() {
    super('nguoi_dung');
  }

  /**
   * Tìm người dùng bằng email hoặc tên đăng nhập
   * @param {string} identifier - Email hoặc Tên đăng nhập
   * @returns {Promise<Object|null>}
   */
  async findByIdentifier(identifier) {
    const isEmail = identifier && identifier.includes('@');
    const filter = isEmail ? { email: identifier } : { ten_dang_nhap: identifier };
    
    return await this.findOne(filter);
  }

  /**
   * Kiểm tra đăng nhập
   * @param {string} identifier - Email hoặc Tên đăng nhập
   * @param {string} password - Mật khẩu
   * @returns {Promise<Object>}
   */
  async authenticate(identifier, password) {
    const user = await this.findByIdentifier(identifier);
    
    if (!user || user.matkhau !== password) {
      throw new Error('Tài khoản, email hoặc mật khẩu không đúng / アカウント、メールアドレスまたはパスワードが正しくありません');
    }
    
    return user;
  }
}

module.exports = new NguoiDung();