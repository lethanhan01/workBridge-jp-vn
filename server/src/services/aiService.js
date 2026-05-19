const { geminiModel } = require('../config/gemini');

async function analyzeMessage(noiDung, ngonNguNguoiGui) {
  const tenNgonNguGui = ngonNguNguoiGui === 'vi' ? 'tiếng Việt' : 'tiếng Nhật';

  const prompt = `Bạn là trợ lý AI chuyên nghiệp hiểu văn hóa doanh nghiệp Nhật - Việt.
Phân tích tin nhắn sau và trả về JSON thuần, không có markdown, không có backtick.

Tin nhắn (${tenNgonNguGui}): "${noiDung}"

Trả về đúng format này:
{
  "sac_thai": "trang trọng hoặc thân mật hoặc trung lập",
  "tom_tat_y_dinh": "mô tả ngắn ý định người gửi, 1 câu",
  "goi_y": [
    { "tieng_viet": "gợi ý trả lời 1", "tieng_nhat": "返答の提案1", "muc_do": 3 },
    { "tieng_viet": "gợi ý trả lời 2", "tieng_nhat": "返答の提案2", "muc_do": 2 },
    { "tieng_viet": "gợi ý trả lời 3", "tieng_nhat": "返答の提案3", "muc_do": 1 }
  ]
}`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[aiService] Lỗi Gemini:', err.message);
    return { sac_thai: null, tom_tat_y_dinh: null, goi_y: [] };
  }
}

module.exports = { analyzeMessage };