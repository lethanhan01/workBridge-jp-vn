const supabase = require('../config/supabase');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.supabase = supabase;
  }

  async findOne(filters = {}) {
    let query = this.supabase.from(this.tableName).select('*');
    
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });

    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
      throw error;
    }
    return data;
  }

  async findAll(filters = {}) {
    let query = this.supabase.from(this.tableName).select('*');
    
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async create(payload) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}

module.exports = BaseModel;
