const supabase = require('../config/supabase');
const tinNhan = require('../models/tinnhan');
const banDich = require('../models/bandich');
const phanTichYNghia = require('../models/phantichynghia');
const { analyzeMessage } = require('./aiService');

async function xuLyTinNhanMoi({ noi_dung, ma_cuoc_hoi_thoai, ma_nguoi_gui }, io) {
  // 1. Lưu tin nhắn gốc
  const tinNhanMoi = await tinNhan.sendMessage({
    maNguoiGui: ma_nguoi_gui,
    maCuocHoiThoai: ma_cuoc_hoi_thoai,
    noiDung: noi_dung,
  });

  // 2. Broadcast ngay — cả người gửi lẫn người nhận đều nhận được tin nhắn gốc
  io.to(ma_cuoc_hoi_thoai).emit('receive_message', {
    ...tinNhanMoi,
    ban_dich: null,
    goi_y: [],
  });

  // 3. AI chạy trong nền, broadcast lần 2 khi xong
  _xuLyAI(tinNhanMoi.ma_tin_nhan, noi_dung, ma_nguoi_gui)
    .then((aiData) => {
      io.to(ma_cuoc_hoi_thoai).emit('message_ai_ready', {
        ma_tin_nhan: tinNhanMoi.ma_tin_nhan,
        ban_dich: aiData.ban_dich,
        sac_thai: aiData.sac_thai,
        tom_tat_y_dinh: aiData.tom_tat_y_dinh,
        goi_y: aiData.goi_y,
      });
    })
    .catch((err) => console.error('[messageService] Lỗi AI:', err.message));
}

async function _xuLyAI(maTinNhan, noiDung, maNguoiGui) {
  const { data: nguoiDung } = await supabase
    .from('nguoi_dung')
    .select('ma_ngon_ngu')
    .eq('ma_nguoi_dung', maNguoiGui)
    .single();

  const ngonNgu = nguoiDung?.ma_ngon_ngu || 'vi';
  const aiData = await analyzeMessage(noiDung, ngonNgu);

  await banDich.create({
    maTinNhan,
    noiDungGoc: noiDung,
    noiDungDaDich: aiData.ban_dich,
  });

  if (aiData.sac_thai) {
    await phanTichYNghia.createWithGoiY({
      maTinNhan,
      sacThai: aiData.sac_thai,
      tomTatYDinh: aiData.tom_tat_y_dinh,
      danhSachGoiY: aiData.goi_y,
    });
  }

  return aiData;
}

module.exports = { xuLyTinNhanMoi };