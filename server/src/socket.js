/**
 * socket.js — Server-side Socket.IO handler
 *
 * Cách sử dụng (từ bin/www):
 *   const { initSocket } = require('../src/socket');
 *   initSocket(server);
 *
 * ============================================================
 * EVENTS (Client → Server)
 * ============================================================
 *  "join_room"      { userId }           — Đăng ký user online
 *  "send_message"   { senderId, receiverId, content, type? }
 *                     type: 'text' | 'file'  (mặc định 'text')
 *
 * EVENTS (Server → Client)
 * ============================================================
 *  "receive_message"  { id, senderId, receiverId, content, type, createdAt }
 *  "user_online"      { userId }
 *  "user_offline"     { userId }
 *
 * ============================================================
 * TODO cho team BE:
 * ============================================================
 *  1. Import Supabase client (hoặc model) để lưu tin nhắn vào DB
 *     Ví dụ: const { saveMessage } = require('./models/messageModel');
 *
 *  2. Trong handler "send_message":
 *     a. Validate dữ liệu (senderId, receiverId, content bắt buộc)
 *     b. Gọi saveMessage(data) để insert vào bảng messages
 *     c. Emit kết quả đến đúng receiver (dùng onlineUsers map)
 *
 *  3. Thêm xác thực JWT khi connect (middleware):
 *     io.use((socket, next) => {
 *       const token = socket.handshake.auth.token;
 *       // verify token ...
 *       next();
 *     });
 * ============================================================
 */

const { Server } = require('socket.io');

// Map userId → socketId để biết user nào đang online
const onlineUsers = new Map();

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // ---- User đăng ký online ----
    socket.on('join_room', ({ userId }) => {
      if (!userId) return;
      onlineUsers.set(String(userId), socket.id);
      console.log(`[Socket] User ${userId} online → ${socket.id}`);

      // Thông báo cho tất cả biết user này online
      socket.broadcast.emit('user_online', { userId });
    });

    // ---- Gửi tin nhắn ----
    socket.on('send_message', async (data) => {
      const { senderId, receiverId, content, type = 'text' } = data;

      // --- TODO BE: Lưu vào database tại đây ---
      // Ví dụ:
      // const saved = await saveMessage({ senderId, receiverId, content, type });
      // const messagePayload = saved;

      // Tạm thời: trả về payload ngay không qua DB
      const messagePayload = {
        id: Date.now(),          // TODO: thay bằng id từ DB
        senderId,
        receiverId,
        content,
        type,
        createdAt: new Date().toISOString(),
      };

      // Gửi đến receiver nếu đang online
      const receiverSocketId = onlineUsers.get(String(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', messagePayload);
      }

      // Gửi lại cho chính sender để confirm
      socket.emit('receive_message', messagePayload);

      console.log(`[Socket] Message: ${senderId} → ${receiverId} | "${content}"`);
    });

    // ---- Ngắt kết nối ----
    socket.on('disconnect', () => {
      // Tìm và xóa user khỏi onlineUsers
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          socket.broadcast.emit('user_offline', { userId });
          console.log(`[Socket] User ${userId} offline`);
          break;
        }
      }
    });
  });

  return io;
}

module.exports = { initSocket, onlineUsers };
