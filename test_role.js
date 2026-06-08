const supabase = require('./server/src/config/supabase');

async function testRole() {
  const { data, error } = await supabase.from('vai_tro').select('*');
  console.log(data, error);
}

testRole();
