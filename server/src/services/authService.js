const supabase = require('../config/supabase');

const loginUser = async (identifier, password) => {
  let query = supabase.from('nguoi_dung').select('*').eq('matkhau', password);
  
  // Kiểm tra xem identifier có phải là email không (chứa @)
  if (identifier && identifier.includes('@')) {
    query = query.eq('email', identifier);
  } else {
    query = query.eq('ten_dang_nhap', identifier);
  }

  const { data: user, error } = await query.single();
  
  if (error || !user) {
    throw new Error('Tài khoản, email hoặc mật khẩu không đúng / アカウント、メールアドレスまたはパスワードが正しくありません');
  }
  
  return user;
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
