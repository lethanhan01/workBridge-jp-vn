const supabase = require('../config/supabase');
const tinNhan = require('../models/tinnhan');
const banDich = require('../models/bandich');
const phanTichYNghia = require('../models/phantichynghia');
const { analyzeMessage } = require('./aiService');
const { translateText } = require('./googleTranslateService');

function detectLanguage(text) {
  // Biểu thức chính quy phát hiện ký tự tiếng Nhật (Hiragana, Katakana, Kanji)
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  if (japaneseRegex.test(text)) {
    return 'ja';
  }
  return 'vi';
}

async function xuLyTinNhanMoi({ noi_dung, ma_cuoc_hoi_thoai, ma_nguoi_gui }, io) {
  // 1. Lưu tin nhắn gốc
  const tinNhanMoi = await tinNhan.sendMessage({
    maNguoiGui: ma_nguoi_gui,
    maCuocHoiThoai: ma_cuoc_hoi_thoai,
    noiDung: noi_dung,
  });

  // 1.5. Tự động phát hiện ngôn ngữ nhắn và dịch siêu tốc
  const ngonNguGoc = detectLanguage(noi_dung);
  const ngonNguDich = ngonNguGoc === 'vi' ? 'ja' : 'vi';
  
  const noiDungDaDich = await translateText(noi_dung, ngonNguGoc, ngonNguDich);
  
  // Lưu bản dịch vào DB ngay lập tức
  await banDich.create({
    maTinNhan: tinNhanMoi.ma_tin_nhan,
    noiDungGoc: noi_dung,
    noiDungDaDich: noiDungDaDich,
  });

  // 2. Broadcast ngay — cả người gửi lẫn người nhận đều nhận được tin nhắn gốc + bản dịch
  io.to(ma_cuoc_hoi_thoai).emit('receive_message', {
    ...tinNhanMoi,
    ban_dich: [{ noi_dung_da_dich: noiDungDaDich }],
    goi_y: [],
  });

  // 3. AI chạy trong nền (phân tích sắc thái, ý định, gợi ý)
  // Lấy lịch sử trò chuyện (10 tin nhắn gần nhất)
  const recentMessages = await tinNhan.getRecentMessages(ma_cuoc_hoi_thoai, 10);
  const chatHistory = recentMessages.map(m => `[${m.time}] ${m.ma_nguoi_gui === ma_nguoi_gui ? 'Người gửi' : 'Người nhận'}: ${m.noi_dung}`).join('\n');

  _xuLyAI(tinNhanMoi.ma_tin_nhan, noi_dung, ngonNguGoc, ma_cuoc_hoi_thoai, io, chatHistory)
    .catch((err) => console.error('[messageService] Lỗi AI:', err.message));
}

async function _xuLyAI(maTinNhan, noiDung, ngonNguGoc, maCuocHoiThoai, io, chatHistory) {
  const aiData = await analyzeMessage(noiDung, ngonNguGoc, chatHistory);

  if (aiData.ngu_canh_vi || aiData.tom_tat_y_dinh_vi || (aiData.goi_y && aiData.goi_y.length > 0)) {
    // Lưu dưới dạng JSON vào các trường TEXT để hỗ trợ song ngữ
    const sacThaiJson = JSON.stringify({ vi: aiData.ngu_canh_vi || "", ja: aiData.ngu_canh_ja || "" });
    const yDinhJson = JSON.stringify({ vi: aiData.tom_tat_y_dinh_vi || "", ja: aiData.tom_tat_y_dinh_ja || "" });

    await phanTichYNghia.createWithGoiY({
      maTinNhan,
      sacThai: sacThaiJson,
      tomTatYDinh: yDinhJson,
      danhSachGoiY: aiData.goi_y,
    });
    
    io.to(maCuocHoiThoai).emit('message_ai_ready', {
      ma_tin_nhan: maTinNhan,
      ngu_canh: { vi: aiData.ngu_canh_vi, ja: aiData.ngu_canh_ja },
      tom_tat_y_dinh: { vi: aiData.tom_tat_y_dinh_vi, ja: aiData.tom_tat_y_dinh_ja },
      goi_y: aiData.goi_y,
    });
  }

  return aiData;
}

module.exports = { xuLyTinNhanMoi };