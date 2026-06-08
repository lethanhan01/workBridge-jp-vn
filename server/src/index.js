require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const chatRoutes = require('./routes/chatRoute');
const dictionaryRoutes = require('./routes/dictionaryRoute');

// thêm dòng này, bỏ dòng require tinNhan cũ
const { xuLyTinNhanMoi } = require('./services/messageService');
const supabase = require('./config/supabase');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Track active sockets per user to handle multi-tab and refresh properly
const userSockets = new Map();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dictionary', dictionaryRoutes);

// Reset tất cả trạng thái online về false khi server khởi động lại
const resetOnlineStatus = async () => {
  try {
    const { error } = await supabase
      .from('nguoi_dung')
      .update({ trang_thai_online: false })
      .eq('trang_thai_online', true);
    
    if (error) throw error;
    console.log('Đã reset trạng thái online của tất cả users về false');
  } catch (err) {
    console.error('Lỗi khi reset trạng thái online:', err);
  }
};

resetOnlineStatus();

io.on('connection', async (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('A user connected:', socket.id, 'UserId:', userId);

  if (userId) {
    socket.userId = userId;
    
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    const sockets = userSockets.get(userId);
    const isFirstConnection = sockets.size === 0;
    sockets.add(socket.id);

    // Chỉ cập nhật trạng thái online nếu đây là kết nối đầu tiên của user
    if (isFirstConnection) {
      try {
        await supabase
          .from('nguoi_dung')
          .update({ trang_thai_online: true, lan_cuoi_hoat_dong: new Date().toISOString() })
          .eq('ma_nguoi_dung', userId);
      } catch (err) {
        console.error('Error updating online status:', err);
      }
    }
  }

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      await xuLyTinNhanMoi(data, io);
    } catch (err) {
      console.error('Lỗi gửi tin nhắn:', err);
      socket.emit('error', { message: 'Gửi tin nhắn thất bại' });
    }
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      const sockets = userSockets.get(socket.userId);
      if (sockets) {
        sockets.delete(socket.id);
        
        // Chỉ cập nhật offline nếu user không còn tab/kết nối nào
        if (sockets.size === 0) {
          userSockets.delete(socket.userId);
          try {
            await supabase
              .from('nguoi_dung')
              .update({ trang_thai_online: false, lan_cuoi_hoat_dong: new Date().toISOString() })
              .eq('ma_nguoi_dung', socket.userId);
          } catch (err) {
            console.error('Error updating offline status:', err);
          }
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});