const { groq } = require('../config/groq');

async function analyzeMessage(noiDung, ngonNguNguoiGui, chatHistory = "") {
  const tenNgonNguGui = ngonNguNguoiGui === 'vi' ? 'tiếng Việt' : 'tiếng Nhật';

  const prompt = `Bạn là trợ lý AI chuyên nghiệp hiểu văn hóa doanh nghiệp Nhật - Việt.
Phân tích tin nhắn hiện tại dựa trên bối cảnh lịch sử trò chuyện (nếu có) và trả về JSON thuần, không có markdown, không có backtick.

${chatHistory ? `Lịch sử trò chuyện gần đây:\n${chatHistory}\n` : ""}
Tin nhắn hiện tại (${tenNgonNguGui}): "${noiDung}"

Trả về đúng format này:
{
  "ngu_canh_vi": "mô tả ngắn về ngữ cảnh văn hóa (Tiếng Việt), 1 câu",
  "ngu_canh_ja": "mô tả ngắn về ngữ cảnh văn hóa (Tiếng Nhật), 1 câu",
  "tom_tat_y_dinh_vi": "mô tả ngắn ý định người gửi (Tiếng Việt), 1 câu",
  "tom_tat_y_dinh_ja": "mô tả ngắn ý định người gửi (Tiếng Nhật), 1 câu",
  "goi_y": [
    { "tieng_viet": "gợi ý trả lời 1", "tieng_nhat": "返答の提案1", "muc_do": 3 },
    { "tieng_viet": "gợi ý trả lời 2", "tieng_nhat": "返答の提案2", "muc_do": 2 },
    { "tieng_viet": "gợi ý trả lời 3", "tieng_nhat": "返答の提案3", "muc_do": 1 }
  ]
}
Lưu ý: Bắt buộc phải có đủ 3 gợi ý và mỗi gợi ý phải có đúng các key 'tieng_viet', 'tieng_nhat', 'muc_do'.`;

  try {
    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });
    
    const text = result.choices[0]?.message?.content || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[aiService] Lỗi Groq:', err.message);
    return { ngu_canh_vi: null, ngu_canh_ja: null, tom_tat_y_dinh_vi: null, tom_tat_y_dinh_ja: null, goi_y: [] };
  }
}

module.exports = { analyzeMessage };