const supabase = require('../config/supabase');

class BanDich {
  async create({ maTinNhan, noiDungGoc, noiDungDaDich }) {
    const { data, error } = await supabase
      .from('bandich')
      .insert({
        ma_tin_nhan: maTinNhan,
        noidungoc: noiDungGoc,
        noi_dung_da_dich: noiDungDaDich,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = new BanDich();