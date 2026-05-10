// Nhúng file cấu hình kết nối Supabase
const supabase = require('../config/supabase');

const JobModel = {
  /**
   * 1. Lấy danh sách tất cả công việc
   */
  getAllJobs: async () => {
    // Gọi bảng 'jobs' trên Supabase và lấy tất cả các cột (*)
    const { data, error } = await supabase
      .from('jobs')
      .select('*');
    
    // Nếu có lỗi từ database, ném lỗi ra để Route xử lý
    if (error) throw error;
    
    return data;
  },

  /**
   * 2. Lấy chi tiết một công việc theo ID
   */
  getJobById: async (jobId) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId) // Tương đương với: WHERE id = jobId
      .single();       // Chỉ lấy 1 kết quả duy nhất
      
    if (error) throw error;
    return data;
  },

  /**
   * 3. Tạo một công việc mới
   */
  createJob: async (jobData) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData]) // Chèn dữ liệu mới vào
      .select();         // Trả về dữ liệu vừa được tạo
      
    if (error) throw error;
    return data;
  }
};

module.exports = JobModel;