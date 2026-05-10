var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// Secret key cho JWT (trong thực tế nên để trong file .env)
const JWT_SECRET = 'super-secret-key-for-workbridge';

// Database giả lập (In-memory array)
// Chứa một tài khoản test mặc định theo yêu cầu
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin123@gmail.com', // Thay đổi domain tùy ý nếu cần, UI gợi ý chứa "admin"
    password: 'password123',
    nationality: 'Vietnam',
    gender: 'Nam',
    department: 'Quản trị'
  }
];

// Sinh ID tự động cho user mới
let nextId = 2;

// API Đăng ký
router.post('/signup', function(req, res) {
  const { name, email, password, nationality, gender, department } = req.body;

  // Kiểm tra email đã tồn tại chưa
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email đã được sử dụng / メールアドレスは既に使用されています' });
  }

  // Tạo user mới
  const newUser = {
    id: nextId++,
    name,
    email,
    password, // Lưu mật khẩu gốc (Mock DB)
    nationality,
    gender,
    department
  };

  users.push(newUser);
  console.log("Mock DB - Users:", users); // Log để dễ debug

  res.status(201).json({ message: 'Đăng ký thành công / 登録が完了しました！', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// API Đăng nhập
router.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Tìm user theo email
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng / メールアドレスまたはパスワードが正しくありません' });
  }

  // Xác định quyền hạn dựa theo hint từ UI (có chứa "admin" thì là admin)
  const role = email.includes('admin') ? 'admin' : 'user';

  // Tạo token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: role },
    JWT_SECRET,
    { expiresIn: '1h' } // Token có hiệu lực 1 giờ
  );

  res.json({
    message: 'Đăng nhập thành công',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role
    }
  });
});

module.exports = router;
