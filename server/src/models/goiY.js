const supabase = require('../config/supabase');

class GoiY {
  async getByYDinh(maYDinh) {
    const { data, error } = await supabase
      .from('goi_y')
      .select('*')
      .eq('ma_y_dinh', maYDinh)
      .order('muc_do_phu_hop', { ascending: false });

    if (error) throw error;
    return data;
  }
}

module.exports = new GoiY();