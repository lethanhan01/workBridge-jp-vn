const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Lỗi: Thiếu cấu hình Supabase trong file .env!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
