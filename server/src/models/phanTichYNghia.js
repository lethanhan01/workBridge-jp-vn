const supabase = require('../config/supabase');

class PhanTichYNghia {
  async createWithGoiY({ maTinNhan, sacThai, tomTatYDinh, danhSachGoiY }) {
    const { data: phanTich, error: err1 } = await supabase
      .from('phan_tich_y_nghia')
      .insert({
        ma_tin_nhan: maTinNhan,
        sac_thai: sacThai,
        tom_tat_y_dinh: tomTatYDinh,
      })
      .select()
      .single();

    if (err1) throw err1;

    if (danhSachGoiY && danhSachGoiY.length > 0) {
      const rows = danhSachGoiY.map((g) => ({
        ma_y_dinh: phanTich.ma_y_dinh,
        noi_dung_tieng_viet: g.tieng_viet,
        noi_dung_tieng_nhat: g.tieng_nhat,
        muc_do_phu_hop: g.muc_do,
      }));

      const { error: err2 } = await supabase.from('goi_y').insert(rows);
      if (err2) throw err2;
    }

    return phanTich;
  }
}

module.exports = new PhanTichYNghia();