require('dotenv').config({ path: './.env' });
const supabase = require('./src/config/supabase');
const { translateText } = require('./src/services/googleTranslateService');

async function migrate() {
  console.log('Bắt đầu di chuyển và dịch dữ liệu phòng ban, chức vụ...');

  try {
    // Lấy tất cả user có phong_ban hoặc chuc_vu
    const { data: users, error } = await supabase
      .from('nguoi_dung')
      .select('ma_nguoi_dung, phong_ban, chuc_vu, phong_ban_jp, chuc_vu_jp')
      .or('phong_ban.not.is.null,chuc_vu.not.is.null');

    if (error) {
      console.error('Lỗi khi lấy dữ liệu user:', error);
      return;
    }

    console.log(`Tìm thấy ${users.length} người dùng cần kiểm tra.`);

    for (const user of users) {
      let needsUpdate = false;
      const updates = {};

      if (user.phong_ban && !user.phong_ban_jp) {
        console.log(`Dịch phòng ban cho user ${user.ma_nguoi_dung}: "${user.phong_ban}" -> ...`);
        updates.phong_ban_jp = await translateText(user.phong_ban, 'vi', 'ja');
        needsUpdate = true;
      }

      if (user.chuc_vu && !user.chuc_vu_jp) {
        console.log(`Dịch chức vụ cho user ${user.ma_nguoi_dung}: "${user.chuc_vu}" -> ...`);
        updates.chuc_vu_jp = await translateText(user.chuc_vu, 'vi', 'ja');
        needsUpdate = true;
      }

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('nguoi_dung')
          .update(updates)
          .eq('ma_nguoi_dung', user.ma_nguoi_dung);

        if (updateError) {
          console.error(`Lỗi cập nhật user ${user.ma_nguoi_dung}:`, updateError);
        } else {
          console.log(`Cập nhật thành công user ${user.ma_nguoi_dung}.`);
        }
      }
    }

    console.log('Hoàn tất quá trình migrate.');
  } catch (err) {
    console.error('Lỗi không xác định:', err);
  }
}

migrate();
