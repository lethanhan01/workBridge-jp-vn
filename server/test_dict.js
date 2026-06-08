require('dotenv').config();
const supabase = require('./src/config/supabase');

async function test() {
  const { data, error } = await supabase.from('tu_chuyen_nganh').select('*').limit(1);
  console.log('tu_chuyen_nganh schema:', data && data.length > 0 ? Object.keys(data[0]) : 'no data or error');
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
