const http = require('https');

/**
 * Dịch văn bản sử dụng API Google Dịch miễn phí
 * @param {string} text - Nội dung cần dịch
 * @param {string} sourceLang - Mã ngôn ngữ gốc (ví dụ: 'vi', 'ja')
 * @param {string} targetLang - Mã ngôn ngữ đích (ví dụ: 'ja', 'vi')
 * @returns {Promise<string>} - Nội dung đã dịch
 */
function translateText(text, sourceLang, targetLang) {
  return new Promise((resolve, reject) => {
    // Xử lý các trường hợp ngôn ngữ đặc biệt nếu cần, nhưng 'vi' và 'ja' được hỗ trợ chuẩn.
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          // parsed[0] chứa các mảng nhỏ tương ứng với từng câu được dịch
          const translatedText = parsed[0].map(item => item[0]).join('');
          resolve(translatedText);
        } catch (err) {
          console.error('[GoogleTranslate] Lỗi parse JSON:', err.message);
          resolve(text); // Fallback về text gốc nếu lỗi
        }
      });
    }).on('error', (err) => {
      console.error('[GoogleTranslate] Lỗi request:', err.message);
      resolve(text); // Fallback về text gốc nếu mạng lỗi
    });
  });
}

module.exports = { translateText };
