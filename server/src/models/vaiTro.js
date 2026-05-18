const BaseModel = require('./BaseModel');

class VaiTro extends BaseModel {
  constructor() {
    super('vai_tro');
  }

  async getAll() {
    return await this.findAll();
  }

  async findByTen(tenVaiTro) {
    return await this.findOne({ ten_vai_tro: tenVaiTro });
  }
}

module.exports = new VaiTro();