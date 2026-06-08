require('dotenv').config();
const tuChuyenNganh = require('./src/models/tuChuyenNganh');

async function testJoin() {
  try {
    const data = await tuChuyenNganh.getAll();
    const valid = data.find(d => d.thuat_ngu_tieng_nhat);
    console.log("Sample:", valid);
  } catch (err) {
    console.error("Join failed:", err.message);
  }
}
testJoin();
