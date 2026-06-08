const BaseModel = require('./BaseModel');
const supabase = require('../config/supabase');

class TinNhan extends BaseModel {
  constructor() {
    super('tinnhan');
  }

  // Lấy lịch sử tin nhắn kèm bản dịch + phân tích ý nghĩa + gợi ý
  async getByConversationId(maCuocHoiThoai) {
    const { data, error } = await supabase
      .from('tinnhan')
      .select(`
        *,
        bandich ( noi_dung_da_dich ),
        phan_tich_y_nghia (
          sac_thai,
          tom_tat_y_dinh,
          goi_y ( noi_dung_tieng_viet, noi_dung_tieng_nhat, muc_do_phu_hop )
        )
      `)
      .eq('ma_cuoc_hoi_thoai', maCuocHoiThoai)
      .order('time', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getRecentMessages(maCuocHoiThoai, limit = 10) {
    const { data, error } = await supabase
      .from('tinnhan')
      .select('noi_dung, time, ma_nguoi_gui')
      .eq('ma_cuoc_hoi_thoai', maCuocHoiThoai)
      .order('time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[tinnhan.getRecentMessages] Error:', error);
      return [];
    }
    // Reverse to chronological order
    return data.reverse();
  }

  async sendMessage({ maNguoiGui, maCuocHoiThoai, noiDung }) {
    return await this.create({
      ma_nguoi_gui: maNguoiGui,
      ma_cuoc_hoi_thoai: maCuocHoiThoai,
      noi_dung: noiDung,
      time: new Date().toISOString(),
      trang_thai: 'sent',
    });
  }
}

module.exports = new TinNhan();