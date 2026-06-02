const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const VaiTro = require('../models/vaiTro');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const identifier = email;

    const user = await authService.loginUser(identifier, password);

    // Lấy role từ DB
    let role = 'user';
    if (user.ma_vai_tro) {
      const roleData = await VaiTro.findOne({ ma_vai_tro: user.ma_vai_tro });
      if (roleData && roleData.ten_vai_tro && roleData.ten_vai_tro.trim() === 'admin') {
        role = 'admin';
      }
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.ma_nguoi_dung, email: user.email, ten_dang_nhap: user.ten_dang_nhap, role: role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Trả về Token và user info
    res.json({
      message: 'Đăng nhập thành công',
      token: token,
      user: {
        id: user.ma_nguoi_dung,
        name: user.ten || user.ten_dang_nhap,
        email: user.email,
        ten_dang_nhap: user.ten_dang_nhap,
        role: role,
        phong_ban: user.phong_ban,
        chuc_vu: user.chuc_vu
      }
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    if (err.message.includes('Tài khoản, email hoặc mật khẩu không đúng')) {
      return res.status(401).json({ message: err.message });
    }
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, nationality, gender, department } = req.body;
    
    const data = await authService.signupUser(name, email, password);
    
    res.status(201).json({
      message: 'Đăng ký thành công / 登録が完了しました！',
      user: {
        id: data.ma_nguoi_dung,
        name: data.ten,
        email: data.email
      }
    });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    if (err.message.includes('Email đã được sử dụng')) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

module.exports = {
  login,
  signup
};
