const supabase = require('./src/config/supabase');

async function checkAdmin() {
  console.log("Fetching roles...");
  const { data: roles, error: roleError } = await supabase.from('vai_tro').select('*');
  if (roleError) console.error("Error roles:", roleError);
  console.log("Roles in DB:", roles);

  let adminRoleId = null;
  if (roles) {
    const adminRole = roles.find(r => r.ten_vai_tro === 'admin');
    if (adminRole) adminRoleId = adminRole.ma_vai_tro;
  }

  console.log("Admin Role ID:", adminRoleId);

  if (adminRoleId) {
    console.log("Fetching users with admin role...");
    const { data: admins, error: adminError } = await supabase.from('nguoi_dung').select('email, ten_dang_nhap, ten').eq('ma_vai_tro', adminRoleId);
    if (adminError) console.error("Error admins:", adminError);
    console.log("Admins in DB:", admins);
  } else {
    console.log("No admin role found in vai_tro table.");
  }
}

checkAdmin();
