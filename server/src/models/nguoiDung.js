const BaseModel = require('./BaseModel');

class NguoiDung extends BaseModel {
  constructor() {
    super('nguoi_dung');
  }

  async findByIdentifier(identifier) {
    const isEmail = identifier && identifier.includes('@');
    const filter = isEmail ? { email: identifier } : { ten_dang_nhap: identifier };
    return await this.findOne(filter);
  }

  async authenticate(identifier, password) {
    const user = await this.findByIdentifier(identifier);
    if (!user || user.matkhau !== password) {
      throw new Error('Tài khoản, email hoặc mật khẩu không đúng / アカウント、メールアドレスまたはパスワードが正しくありません');
    }
    return user;
  }

  // Thêm mới: cập nhật ngôn ngữ người dùng
  async updateNgonNgu(maNguoiDung, maNgonNgu) {
    const { data, error } = await this.supabase
      .from('nguoi_dung')
      .update({ ma_ngon_ngu: maNgonNgu })
      .eq('ma_nguoi_dung', maNguoiDung)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Thêm mới: lấy ngôn ngữ của người dùng
  async getNgonNgu(maNguoiDung) {
    const user = await this.findOne({ ma_nguoi_dung: maNguoiDung });
    return user?.ma_ngon_ngu || 'vi'; // mặc định tiếng Việt nếu chưa set
  }
}

module.exports = new NguoiDung();