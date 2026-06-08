require('dotenv').config({ path: './server/.env' });
const supabase = require('./server/src/config/supabase');

async function testCounts(userId) {
  // 1. Total users
  const { count: partnersCount } = await supabase
    .from('nguoi_dung')
    .select('*', { count: 'exact', head: true });
    
  // 2. Messages and translations
  const { data: userMessages, error } = await supabase
    .from('tinnhan')
    .select('ma_tin_nhan, bandich(noi_dung_da_dich)')
    .eq('ma_nguoi_gui', userId);

  console.log("Error:", error);
  console.log("Messages length:", userMessages ? userMessages.length : 0);
  
  const messageCount = userMessages ? userMessages.length : 0;
  let translationCount = 0;
  if (userMessages) {
    userMessages.forEach(msg => {
      if (msg.bandich && Array.isArray(msg.bandich)) {
        translationCount += msg.bandich.length;
      } else if (msg.bandich) {
        translationCount += 1;
      }
    });
  }

  console.log({
    partnersCount,
    messageCount,
    translationCount
  });
}

testCounts('c16e7f22-2628-4ce6-a7dc-3e9a4ce608aa').catch(console.error);
