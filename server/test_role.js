require('dotenv').config({ path: '.env' });
const supabase = require('./src/config/supabase');

async function test() {
  const { data, error } = await supabase.from('nguoi_dung').select('ma_nguoi_dung, ma_vai_tro').limit(5);
  console.log('data:', data);
  console.log('error:', error);
}
test();
