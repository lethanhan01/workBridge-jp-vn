require('dotenv').config();
const supabase = require('./src/config/supabase');

async function seedData() {
  try {
    // 1. Get existing specialties
    let { data: chuyenNganhs, error: fetchError } = await supabase.from('chuyen_nganh').select('*');
    if (fetchError) throw fetchError;

    if (!chuyenNganhs || chuyenNganhs.length === 0) {
      console.log("No chuyen_nganh found. Creating some default ones...");
      const defaultCN = [
        { ten_chuyen_nganh_vn: 'Công nghệ thông tin (IT)', ten_chuyen_nganh_jp: 'IT' },
        { ten_chuyen_nganh_vn: 'Kế toán - Tài chính', ten_chuyen_nganh_jp: '経理・財務' },
        { ten_chuyen_nganh_vn: 'Y tế - Điều dưỡng', ten_chuyen_nganh_jp: '医療・介護' }
      ];
      const { data: insertedCN, error: insertCNError } = await supabase.from('chuyen_nganh').insert(defaultCN).select();
      if (insertCNError) throw insertCNError;
      chuyenNganhs = insertedCN;
    }

    console.log("Found chuyen_nganh:", chuyenNganhs);

    // 2. Prepare words to insert for each
    const wordsToInsert = [];

    for (const cn of chuyenNganhs) {
      const tenVn = cn.ten_chuyen_nganh_vn.toLowerCase();
      if (tenVn.includes('thông tin') || tenVn.includes('it')) {
        wordsToInsert.push(
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: 'サーバー', thuat_ngu_tieng_viet: 'Máy chủ', giai_thich_tieng_nhat: 'サービスを提供するコンピュータ', giai_thich_ngu_tieng_viet: 'Máy tính cung cấp dịch vụ', vi_du_tieng_nhat: 'サーバーがダウンしました。', vi_du_tieng_viet: 'Máy chủ đã bị sập.' },
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: 'データベース', thuat_ngu_tieng_viet: 'Cơ sở dữ liệu', giai_thich_tieng_nhat: 'データの集まり', giai_thich_ngu_tieng_viet: 'Tập hợp dữ liệu', vi_du_tieng_nhat: 'データベースを更新します。', vi_du_tieng_viet: 'Cập nhật cơ sở dữ liệu.' },
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: 'デプロイ', thuat_ngu_tieng_viet: 'Triển khai', giai_thich_tieng_nhat: 'システムを使える状態にすること', giai_thich_ngu_tieng_viet: 'Làm cho hệ thống sẵn sàng sử dụng', vi_du_tieng_nhat: '本番環境にデプロイする。', vi_du_tieng_viet: 'Triển khai lên môi trường production.' }
        );
      } else if (tenVn.includes('kế toán') || tenVn.includes('tài chính')) {
        wordsToInsert.push(
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '売上高', thuat_ngu_tieng_viet: 'Doanh thu', giai_thich_tieng_nhat: '商品を販売して得た金額', giai_thich_ngu_tieng_viet: 'Số tiền thu được từ việc bán hàng hóa', vi_du_tieng_nhat: '今年の売上高は増加した。', vi_du_tieng_viet: 'Doanh thu năm nay đã tăng.' },
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '利益', thuat_ngu_tieng_viet: 'Lợi nhuận', giai_thich_tieng_nhat: '収入から支出を引いた金額', giai_thich_ngu_tieng_viet: 'Số tiền còn lại sau khi lấy thu nhập trừ đi chi phí', vi_du_tieng_nhat: '利益を上げる。', vi_du_tieng_viet: 'Tăng lợi nhuận.' },
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '経費', thuat_ngu_tieng_viet: 'Chi phí', giai_thich_tieng_nhat: '事業を行うために必要な費用', giai_thich_ngu_tieng_viet: 'Chi phí cần thiết để tiến hành kinh doanh', vi_du_tieng_nhat: '経費を削減する。', vi_du_tieng_viet: 'Cắt giảm chi phí.' }
        );
      } else if (tenVn.includes('y tế') || tenVn.includes('điều dưỡng')) {
        wordsToInsert.push(
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '血圧', thuat_ngu_tieng_viet: 'Huyết áp', giai_thich_tieng_nhat: '血液が血管の壁を押す力', giai_thich_ngu_tieng_viet: 'Áp lực của máu lên thành mạch máu', vi_du_tieng_nhat: '血圧を測ります。', vi_du_tieng_viet: 'Đo huyết áp.' },
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '点滴', thuat_ngu_tieng_viet: 'Truyền dịch', giai_thich_tieng_nhat: '薬液を静脈内に少しずつ注入すること', giai_thich_ngu_tieng_viet: 'Đưa từ từ thuốc lỏng vào tĩnh mạch', vi_du_tieng_nhat: '点滴をします。', vi_du_tieng_viet: 'Thực hiện truyền dịch.' },
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '車椅子', thuat_ngu_tieng_viet: 'Xe lăn', giai_thich_tieng_nhat: '歩行が困難な人のための車', giai_thich_ngu_tieng_viet: 'Xe dành cho người gặp khó khăn trong việc đi lại', vi_du_tieng_nhat: '車椅子を押します。', vi_du_tieng_viet: 'Đẩy xe lăn.' }
        );
      } else {
        wordsToInsert.push(
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '基本', thuat_ngu_tieng_viet: 'Cơ bản', giai_thich_tieng_nhat: '物事の基礎', giai_thich_ngu_tieng_viet: 'Nền tảng của sự vật, sự việc', vi_du_tieng_nhat: '基本が大切です。', vi_du_tieng_viet: 'Cơ bản là điều quan trọng.' },
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '応用', thuat_ngu_tieng_viet: 'Ứng dụng', giai_thich_tieng_nhat: '基本を実際の物事に当てはめて使うこと', giai_thich_ngu_tieng_viet: 'Áp dụng cơ bản vào thực tế', vi_du_tieng_nhat: '応用問題に挑戦する。', vi_du_tieng_viet: 'Thử thách với câu hỏi ứng dụng.' },
          { ma_chuyen_nganh: cn.ma_chuyen_nganh, thuat_ngu_tieng_nhat: '専門', thuat_ngu_tieng_viet: 'Chuyên môn', giai_thich_tieng_nhat: '特定の学問や職業', giai_thich_ngu_tieng_viet: 'Học thuật hoặc nghề nghiệp cụ thể', vi_du_tieng_nhat: '専門的な知識。', vi_du_tieng_viet: 'Kiến thức chuyên môn.' }
        );
      }
    }

    if (wordsToInsert.length > 0) {
      const { data: insertedWords, error: insertWordsError } = await supabase.from('tu_chuyen_nganh').insert(wordsToInsert).select();
      if (insertWordsError) throw insertWordsError;
      console.log(`Successfully inserted ${insertedWords.length} words.`);
    } else {
      console.log("No words to insert.");
    }

  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seedData();
