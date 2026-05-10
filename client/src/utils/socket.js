/**
 * socket.js — Client-side Socket.IO singleton
 *
 * Import và dùng ở bất kỳ component nào:
 *   import socket from '../utils/socket';
 *   socket.emit('send_message', { ... });
 *   socket.on('receive_message', (msg) => { ... });
 *
 * ============================================================
 * Các bước để kích hoạt kết nối thật:
 * ============================================================
 *  1. Đảm bảo user đã đăng nhập và có token trong localStorage
 *  2. Gọi connectSocket() ngay sau khi login thành công
 *  3. Gọi disconnectSocket() khi logout
 *
 * ============================================================
 * TODO cho team FE:
 * ============================================================
 *  - Truyền JWT token trong auth khi kết nối (xem connectSocket bên dưới)
 *  - Sau khi kết nối, emit 'join_room' với userId của user hiện tại
 *  - Trong Chat.jsx, lắng nghe 'receive_message' để update messages state
 * ============================================================
 */

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Khởi tạo lazy — chưa kết nối ngay
let socket = io(SOCKET_URL, {
  autoConnect: false,       // Không tự kết nối, gọi connectSocket() thủ công
  withCredentials: true,
  auth: {
    // TODO: Thay thế bằng token thật khi team BE setup JWT middleware
    token: () => localStorage.getItem('token') || '',
  },
});

/**
 * Kết nối socket và tự động join_room với userId hiện tại.
 * Gọi hàm này ngay sau khi user đăng nhập thành công.
 */
export function connectSocket() {
  if (socket.connected) return;

  // Cập nhật token mới nhất trước khi kết nối
  socket.auth = { token: localStorage.getItem('token') || '' };
  socket.connect();

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);

    // Đăng ký user online
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      socket.emit('join_room', { userId: user.id });
    }
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });
}

/**
 * Ngắt kết nối socket.
 * Gọi hàm này khi user logout.
 */
export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
    console.log('[Socket] Manually disconnected');
  }
}

// Export socket instance để dùng trực tiếp trong các component
export default socket;
