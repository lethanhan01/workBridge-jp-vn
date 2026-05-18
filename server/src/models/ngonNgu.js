const BaseModel = require('./BaseModel');

class NgonNgu extends BaseModel {
  constructor() {
    super('nguoi_dung_ngon_ngu');
  }

  async getAll() {
    return await this.findAll();
  }
}

module.exports = new NgonNgu();