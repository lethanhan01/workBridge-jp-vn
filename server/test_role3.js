require('dotenv').config({ path: '.env' });
const supabase = require('./src/config/supabase');

async function test() {
  const { data, error } = await supabase.from('vai_tro').select('*');
  console.log('data:', data);
  console.log('error:', error);
}
test();
