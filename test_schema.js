require('dotenv').config({ path: './server/.env' });
const supabase = require('./server/src/config/supabase');

async function test() {
  const { data, error } = await supabase.from('nguoi_dung_yeu_thich_tu').select('*').limit(1);
  console.log('nguoi_dung_yeu_thich_tu schema:', data && data.length > 0 ? Object.keys(data[0]) : 'no data or error');
  console.log('Error:', error);
}

test();
