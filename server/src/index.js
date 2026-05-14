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


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cấu hình lại theo domain thực tế khi deploy
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);


const tinNhan = require('./models/tinnhan');

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('send_message', async (data) => {
    // data: { ma_cuoc_hoi_thoai, ma_nguoi_gui, noi_dung }
    try {
      // Lưu vào Supabase
      const newMessage = await tinNhan.sendMessage({
        ma_cuoc_hoi_thoai: data.ma_cuoc_hoi_thoai,
        ma_nguoi_gui: data.ma_nguoi_gui,
        noi_dung: data.noi_dung
      });

      // Phát tín hiệu cho mọi người trong phòng (bao gồm cả data từ DB như ma_tin_nhan, time)
      io.to(data.ma_cuoc_hoi_thoai).emit('receive_message', newMessage);
    } catch (err) {
      console.error("Lỗi khi lưu/gửi tin nhắn:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
