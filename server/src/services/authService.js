const NguoiDung = require('../models/nguoiDung');
const supabase = require('../config/supabase');

const loginUser = async (identifier, password) => {
  return await NguoiDung.authenticate(identifier, password);
};

// Hàm signup vẫn gọi query supabase (theo plan giữ lại để route cũ không hỏng nếu migrate cả file)
const signupUser = async (name, email, password) => {
  // Kiểm tra xem email đã tồn tại chưa
  const { data: existingUser } = await supabase
    .from('nguoi_dung')
    .select('email')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new Error('Email đã được sử dụng / メールアドレスは既に使用されています');
  }

  // Insert user mới vào bảng nguoi_dung
  const { data, error } = await supabase
    .from('nguoi_dung')
    .insert([
      {
        ten: name,
        email: email,
        matkhau: password,
        ten_dang_nhap: email
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  loginUser,
  signupUser
};
