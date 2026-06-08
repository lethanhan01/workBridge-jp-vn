const tuChuyenNganh = require('../models/tuChuyenNganh');

const dictionaryController = {
  // Lấy toàn bộ danh sách từ điển kèm trạng thái yêu thích của user
  getAllDictionary: async (req, res) => {
    try {
      const allWords = await tuChuyenNganh.getAll();
      let favoriteWordIds = new Set();

      // Nếu user đã đăng nhập, lấy danh sách từ yêu thích của user
      if (req.user && req.user.id) {
        const favorites = await tuChuyenNganh.getYeuThichByUser(req.user.id);
        favorites.forEach(f => favoriteWordIds.add(f.ma_tu));
      }

      // Format dữ liệu khớp với Interface DictionaryEntry ở Frontend
      // Filter out empty rows where both thuat_ngu_tieng_nhat and thuat_ngu_tieng_viet are null or empty
      const validWords = allWords.filter(word => word.thuat_ngu_tieng_nhat || word.thuat_ngu_tieng_viet);

      const formattedWords = validWords.map(word => {
        let categoryName = 'Khác';
        if (word.chuyen_nganh && word.chuyen_nganh.ten_chuyen_nganh_jp && word.chuyen_nganh.ten_chuyen_nganh_vn) {
          categoryName = `${word.chuyen_nganh.ten_chuyen_nganh_jp} / ${word.chuyen_nganh.ten_chuyen_nganh_vn}`;
        } else if (word.chuyen_nganh && word.chuyen_nganh.ten_chuyen_nganh_vn) {
          categoryName = word.chuyen_nganh.ten_chuyen_nganh_vn;
        } else if (typeof word.chuyen_nganh === 'string') {
          categoryName = word.chuyen_nganh; // Fallback in case of raw string
        }

        return {
          id: word.ma_tu,
          termJp: word.thuat_ngu_tieng_nhat || '',
          termVn: word.thuat_ngu_tieng_viet || '',
          category: categoryName,
          definitionJp: word.giai_thich_tieng_nhat || '',
          definitionVn: word.giai_thich_ngu_tieng_viet || '',
          exampleJp: word.vi_du_tieng_nhat || '',
          exampleVn: word.vi_du_tieng_viet || '',
          isFavorite: favoriteWordIds.has(word.ma_tu)
        };
      });

      res.json(formattedWords);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách từ điển:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  },

  // Toggle trạng thái yêu thích
  toggleFavorite: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id) {
        return res.status(400).json({ message: 'Thiếu ID từ vựng' });
      }

      const result = await tuChuyenNganh.toggleYeuThich(userId, id);
      res.json({ message: 'Thành công', action: result.action });
    } catch (error) {
      console.error('Lỗi toggle yêu thích từ vựng:', error);
      res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
  }
};

module.exports = dictionaryController;
