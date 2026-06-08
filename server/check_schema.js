require('dotenv').config();
const supabase = require('./src/config/supabase');

async function checkSchema() {
  console.log("Checking chuyen_nganh...");
  const { data: dataC, error: errC } = await supabase.from('chuyen_nganh').select('*').limit(1);
  if (errC) console.error("Error chuyen_nganh:", errC);
  else console.log("chuyen_nganh schema:", dataC && dataC.length > 0 ? Object.keys(dataC[0]) : "No data, but table exists.");

  console.log("Checking tu_chuyen_nganh...");
  const { data: dataT, error: errT } = await supabase.from('tu_chuyen_nganh').select('*, chuyen_nganh(*)').limit(1);
  if (errT) console.error("Error tu_chuyen_nganh:", errT);
  else console.log("tu_chuyen_nganh schema (with join):", dataT && dataT.length > 0 ? Object.keys(dataT[0]) : "No data, but table exists.");
  if (dataT && dataT.length > 0) {
    console.log("Joined data sample:", JSON.stringify(dataT[0], null, 2));
  }
}

checkSchema();
