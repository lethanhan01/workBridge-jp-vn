require('dotenv').config({ path: '.env' });
const supabase = require('./src/config/supabase');

async function test() {
  const { data, error } = await supabase.from('vaitro').select('*');
  console.log('data:', data);
  console.log('error:', error);
}
test();
