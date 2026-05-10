const { createClient } = require('@supabase/supabase-js');

// 1. Lấy thông tin URL và Key từ biến môi trường
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 2. Kiểm tra an toàn: Cảnh báo nếu quên điền Key trong file .env
if (!supabaseUrl || !supabaseKey) {
  console.error("LỖI CỰC KỲ NGHIÊM TRỌNG: Chưa tìm thấy SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong file .env của Server!");
}

// 3. Khởi tạo đối tượng kết nối (Client)
const supabase = createClient(supabaseUrl, supabaseKey);

// 4. Xuất đối tượng này ra để các file Models khác có thể dùng chung
module.exports = supabase;