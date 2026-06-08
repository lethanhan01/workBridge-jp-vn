const supabase = require('../config/supabase');
const { translateText } = require('../services/googleTranslateService');

const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('ma_nguoi_dung, ten, email, ten_dang_nhap, ma_ngon_ngu, phong_ban, chuc_vu, phong_ban_jp, chuc_vu_jp, trang_thai_online, lan_cuoi_hoat_dong');

    if (error) throw error;

    console.log("Dữ liệu người dùng từ DB:", data);
    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy danh sách người dùng:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('ma_nguoi_dung, ten, email, ten_dang_nhap, ma_ngon_ngu, ma_vai_tro, matkhau, phong_ban, chuc_vu, phong_ban_jp, chuc_vu_jp, trang_thai_online, lan_cuoi_hoat_dong')
      .eq('ma_nguoi_dung', userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy thông tin cá nhân:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ten, email, ma_ngon_ngu, matkhau, phong_ban, chuc_vu, input_language } = req.body;

    const updates = {};
    if (ten !== undefined) updates.ten = ten;
    if (email !== undefined) updates.email = email;
    if (ma_ngon_ngu !== undefined) updates.ma_ngon_ngu = ma_ngon_ngu;
    if (matkhau !== undefined && matkhau !== '') updates.matkhau = matkhau;
    
    if (phong_ban !== undefined || chuc_vu !== undefined) {
      if (phong_ban !== undefined) {
        if (input_language === 'ja') {
          updates.phong_ban_jp = phong_ban;
          updates.phong_ban = await translateText(phong_ban, 'ja', 'vi');
        } else {
          updates.phong_ban = phong_ban;
          updates.phong_ban_jp = await translateText(phong_ban, 'vi', 'ja');
        }
      }
      
      if (chuc_vu !== undefined) {
        if (input_language === 'ja') {
          updates.chuc_vu_jp = chuc_vu;
          updates.chuc_vu = await translateText(chuc_vu, 'ja', 'vi');
        } else {
          updates.chuc_vu = chuc_vu;
          updates.chuc_vu_jp = await translateText(chuc_vu, 'vi', 'ja');
        }
      }
    }

    const { data, error } = await supabase
      .from('nguoi_dung')
      .update(updates)
      .eq('ma_nguoi_dung', userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Cập nhật thành công', user: data });
  } catch (err) {
    console.error("Lỗi cập nhật thông tin cá nhân:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('ma_nguoi_dung, ten, email, ten_dang_nhap, ma_ngon_ngu, matkhau, phong_ban, chuc_vu, phong_ban_jp, chuc_vu_jp, trang_thai_online, lan_cuoi_hoat_dong, vai_tro(ten_vai_tro)')
      .eq('ma_nguoi_dung', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      throw error;
    }

    // Lấy tổng số người dùng (đối tác trò chuyện)
    const { count: partnersCount } = await supabase
      .from('nguoi_dung')
      .select('*', { count: 'exact', head: true });

    // Lấy tin nhắn và bản dịch để tính count
    const { data: userMessages } = await supabase
      .from('tinnhan')
      .select('ma_tin_nhan, bandich(ma_ban_dich)')
      .eq('ma_nguoi_gui', userId);

    const messageCount = userMessages ? userMessages.length : 0;
    let translationCount = 0;
    if (userMessages) {
      userMessages.forEach(msg => {
        if (msg.bandich && Array.isArray(msg.bandich)) translationCount += msg.bandich.length;
        else if (msg.bandich) translationCount += 1;
      });
    }

    // Lấy hoạt động gần đây (Tin nhắn)
    const { data: recentMsgs } = await supabase
      .from('tinnhan')
      .select('ma_tin_nhan, time, cuoc_hoi_thoai(ten_cuoc_hoi_thoai)')
      .eq('ma_nguoi_gui', userId)
      .order('time', { ascending: false })
      .limit(5);

    // Lấy hoạt động gần đây (Tham gia hội thoại)
    const { data: recentConvs } = await supabase
      .from('thanhvienhoithoai')
      .select('ngay_tham_gia, cuoc_hoi_thoai(ten_cuoc_hoi_thoai)')
      .eq('ma_nguoi_dung', userId)
      .order('ngay_tham_gia', { ascending: false })
      .limit(5);

    const activities = [];
    if (recentMsgs) {
      recentMsgs.forEach(m => {
        activities.push({
          id: 'msg-' + m.ma_tin_nhan,
          type: 'message',
          description: `メッセージを送信しました (${m.cuoc_hoi_thoai?.ten_cuoc_hoi_thoai || '会話'})`,
          descriptionVn: `Đã gửi tin nhắn trong ${m.cuoc_hoi_thoai?.ten_cuoc_hoi_thoai || 'cuộc trò chuyện'}`,
          time: m.time,
          timestamp: new Date(m.time).getTime()
        });
        activities.push({
          id: 'trans-' + m.ma_tin_nhan,
          type: 'translation',
          description: `メッセージを翻訳しました`,
          descriptionVn: `Đã dịch tin nhắn tự động`,
          time: new Date(new Date(m.time).getTime() + 1000).toISOString(),
          timestamp: new Date(m.time).getTime() + 1000
        });
      });
    }

    if (recentConvs) {
      recentConvs.forEach((c, idx) => {
        activities.push({
          id: 'conv-' + idx,
          type: 'conversation',
          description: `${c.cuoc_hoi_thoai?.ten_cuoc_hoi_thoai || '新しい会話'}に参加しました`,
          descriptionVn: `Đã tham gia ${c.cuoc_hoi_thoai?.ten_cuoc_hoi_thoai || 'cuộc trò chuyện'}`,
          time: c.ngay_tham_gia,
          timestamp: new Date(c.ngay_tham_gia).getTime()
        });
      });
    }

    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivity = activities.slice(0, 5).map(a => {
      delete a.timestamp;
      return a;
    });

    res.json({
      ...data,
      messageCount,
      translationCount,
      partnersCount: partnersCount || 0,
      recentActivity
    });
  } catch (err) {
    console.error("Lỗi lấy thông tin người dùng by ID:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const updateUserAdmin = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { phong_ban, chuc_vu, role, input_language } = req.body;
    
    const updates = {};
    if (phong_ban !== undefined) {
      if (input_language === 'ja') {
        updates.phong_ban_jp = phong_ban;
        updates.phong_ban = await translateText(phong_ban, 'ja', 'vi');
      } else {
        updates.phong_ban = phong_ban;
        updates.phong_ban_jp = await translateText(phong_ban, 'vi', 'ja');
      }
    }
    
    if (chuc_vu !== undefined) {
      if (input_language === 'ja') {
        updates.chuc_vu_jp = chuc_vu;
        updates.chuc_vu = await translateText(chuc_vu, 'ja', 'vi');
      } else {
        updates.chuc_vu = chuc_vu;
        updates.chuc_vu_jp = await translateText(chuc_vu, 'vi', 'ja');
      }
    }
    if (role !== undefined) {
      if (role === 'admin') {
        const { data: roleData } = await supabase.from('vai_tro').select('ma_vai_tro').ilike('ten_vai_tro', '%admin%').limit(1).single();
        if (roleData) updates.ma_vai_tro = roleData.ma_vai_tro;
      } else {
        updates.ma_vai_tro = null;
      }
    }

    const { data, error } = await supabase
      .from('nguoi_dung')
      .update(updates)
      .eq('ma_nguoi_dung', targetUserId)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Cập nhật thành công', user: data });
  } catch (err) {
    console.error("Lỗi cập nhật user bởi admin:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const createUser = async (req, res) => {
  try {
    const { ten, email, matkhau, ma_ngon_ngu, phong_ban, chuc_vu, input_language } = req.body;
    
    // Check if email exists
    const { data: existingUser } = await supabase
      .from('nguoi_dung')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng / メールアドレスは既に使用されています' });
    }

    let phong_ban_final = phong_ban;
    let phong_ban_jp_final = null;
    let chuc_vu_final = chuc_vu;
    let chuc_vu_jp_final = null;

    if (phong_ban) {
      if (input_language === 'ja') {
        phong_ban_jp_final = phong_ban;
        phong_ban_final = await translateText(phong_ban, 'ja', 'vi');
      } else {
        phong_ban_final = phong_ban;
        phong_ban_jp_final = await translateText(phong_ban, 'vi', 'ja');
      }
    }

    if (chuc_vu) {
      if (input_language === 'ja') {
        chuc_vu_jp_final = chuc_vu;
        chuc_vu_final = await translateText(chuc_vu, 'ja', 'vi');
      } else {
        chuc_vu_final = chuc_vu;
        chuc_vu_jp_final = await translateText(chuc_vu, 'vi', 'ja');
      }
    }

    // Insert new user
    const { data, error } = await supabase
      .from('nguoi_dung')
      .insert([
        {
          ten,
          email,
          matkhau,
          ten_dang_nhap: email,
          ma_ngon_ngu,
          phong_ban: phong_ban_final,
          chuc_vu: chuc_vu_final,
          phong_ban_jp: phong_ban_jp_final,
          chuc_vu_jp: chuc_vu_jp_final
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Tạo tài khoản thành công', user: data });
  } catch (err) {
    console.error("Lỗi tạo user mới bởi admin:", err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUserAdmin,
  createUser
};
