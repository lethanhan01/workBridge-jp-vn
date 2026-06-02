const cuocHoiThoai = require('../models/cuocHoiThoai');
const tinNhan = require('../models/tinnhan');
const supabase = require('../config/supabase');

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await cuocHoiThoai.getByUserId(userId);
    
    const enhancedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Lấy tin nhắn mới nhất
        const { data: lastMessageData, error: msgError } = await supabase
          .from('tinnhan')
          .select(`
            noi_dung, 
            time, 
            bandich ( noi_dung_da_dich )
          `)
          .eq('ma_cuoc_hoi_thoai', conv.ma_cuoc_hoi_thoai)
          .order('time', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (msgError) console.error('Lỗi lấy tin nhắn mới nhất:', msgError);

        // Lấy số lượng tin nhắn chưa đọc
        const { count: unreadCount } = await supabase
          .from('tinnhan')
          .select('ma_tin_nhan', { count: 'exact' })
          .eq('ma_cuoc_hoi_thoai', conv.ma_cuoc_hoi_thoai)
          .neq('ma_nguoi_gui', userId)
          .eq('trang_thai', 'sent');

        const translatedText = lastMessageData?.bandich?.[0]?.noi_dung_da_dich || lastMessageData?.ban_dich?.[0]?.noi_dung_da_dich;
        
        return {
          ...conv,
          lastMessage: lastMessageData ? (translatedText || lastMessageData.noi_dung) : null,
          lastMessageTime: lastMessageData ? lastMessageData.time : conv.ngay_tao,
          unreadCount: unreadCount || 0
        };
      })
    );

    // Sắp xếp hội thoại có tin nhắn mới nhất lên đầu
    enhancedConversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.json(enhancedConversations);
  } catch (err) {
    console.error('Lỗi lấy danh sách hội thoại:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    
    // Cập nhật trạng thái tin nhắn thành 'read' (đã đọc)
    await supabase
      .from('tinnhan')
      .update({ trang_thai: 'read' })
      .eq('ma_cuoc_hoi_thoai', roomId)
      .neq('ma_nguoi_gui', userId)
      .eq('trang_thai', 'sent');

    const data = await tinNhan.getByConversationId(roomId);
    res.json(data);
  } catch (err) {
    console.error('Lỗi lấy tin nhắn:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// Lấy danh sách user để chọn khi tạo chat mới
const getUsers = async (req, res) => {
  try {
    const myId = req.user.id;

    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('ma_nguoi_dung, ten, ten_dang_nhap, email, ma_ngon_ngu')
      .neq('ma_nguoi_dung', myId); // loại bản thân ra

    if (error) throw error;
    
    // Xử lý NULL ma_ngon_ngu - mặc định là 'vi' (Tiếng Việt)
    const processedData = data.map(user => ({
      ...user,
      ma_ngon_ngu: user.ma_ngon_ngu || 'vi'
    }));
    
    res.json(processedData);
  } catch (err) {
    console.error('Lỗi lấy danh sách user:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// Tạo cuộc hội thoại mới (Hỗ trợ cả chat 1-1 và chat nhóm)
const createConversation = async (req, res) => {
  try {
    const myId = req.user.id;
    const { maNguoiDungKia, danhSachMaNguoiDung, tenCuocHoiThoai } = req.body;

    let members = [];
    let nameOfConversation = tenCuocHoiThoai;

    if (danhSachMaNguoiDung && Array.isArray(danhSachMaNguoiDung)) {
      // Chat nhóm
      members = [myId, ...danhSachMaNguoiDung];
      
      // Nếu không gửi tên cuộc hội thoại từ frontend, tự động tạo tên dựa vào các thành viên
      if (!nameOfConversation) {
        const { data: users, error: userError } = await supabase
          .from('nguoi_dung')
          .select('ten')
          .in('ma_nguoi_dung', danhSachMaNguoiDung);
        
        if (!userError && users && users.length > 0) {
          const names = users.map(u => u.ten).join(', ');
          nameOfConversation = `Đoạn chat cùng với ${names}`;
        } else {
          nameOfConversation = `Đoạn chat nhóm ${Date.now()}`;
        }
      }
    } else if (maNguoiDungKia) {
      // Chat 1-1
      members = [myId, maNguoiDungKia];
      
      if (!nameOfConversation) {
        // Lấy tên của người kia để đặt tên hội thoại mặc định
        const { data: userKia, error: userError } = await supabase
          .from('nguoi_dung')
          .select('ten')
          .eq('ma_nguoi_dung', maNguoiDungKia)
          .single();
        
        if (!userError && userKia) {
          nameOfConversation = `Đoạn chat cùng với ${userKia.ten}`;
        } else {
          nameOfConversation = `Đoạn chat ${Date.now()}`;
        }
      }
    } else {
      return res.status(400).json({ message: 'Thiếu thông tin người nhận hoặc danh sách thành viên' });
    }

    const data = await cuocHoiThoai.createWithMembers(nameOfConversation, members);
    res.status(201).json(data);
  } catch (err) {
    console.error('Lỗi tạo cuộc hội thoại:', err);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

module.exports = { getConversations, getMessages, getUsers, createConversation };