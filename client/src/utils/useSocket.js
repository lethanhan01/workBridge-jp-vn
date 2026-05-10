/**
 * useSocket.js — Custom React hook cho Socket.IO
 *
 * Cách dùng trong Chat.jsx:
 *   const { sendMessage, messages } = useSocket(currentUserId, contactId);
 *
 * ============================================================
 * TODO cho team FE:
 * ============================================================
 *  1. Thay DEFAULT_MESSAGES bằng API call lấy lịch sử chat từ DB
 *  2. Khi BE đã có endpoint GET /api/messages?between=A&and=B,
 *     fetch dữ liệu đó trong useEffect và set vào state messages
 *  3. Khi gửi file, truyền thêm field `type: 'file'` và url file đã upload
 * ============================================================
 */

import { useEffect, useState, useCallback } from 'react';
import socket, { connectSocket } from './socket';

/**
 * @param {string|number} currentUserId  - ID của user hiện tại (lấy từ localStorage)
 * @param {string|number} contactId      - ID của người đang chat cùng
 * @param {Array}         initialMessages - Tin nhắn default / lịch sử (tạm thời)
 */
export function useSocket(currentUserId, contactId, initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // Kết nối socket nếu chưa kết nối
    connectSocket();

    // Theo dõi trạng thái kết nối
    function onConnect()    { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }

    // ---- Nhận tin nhắn mới ----
    function onReceiveMessage(msg) {
      // Chỉ hiển thị tin nhắn liên quan đến cuộc hội thoại hiện tại
      const isRelevant =
        (String(msg.senderId) === String(contactId) && String(msg.receiverId) === String(currentUserId)) ||
        (String(msg.senderId) === String(currentUserId) && String(msg.receiverId) === String(contactId));

      if (!isRelevant) return;

      setMessages((prev) => {
        // Tránh duplicate (server trả về cả cho sender)
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, {
          id: msg.id,
          sender: String(msg.senderId) === String(currentUserId) ? 'me' : 'other',
          textJP: msg.content,
          textVN: '',           // TODO: điền kết quả dịch từ BE
          time: new Date(msg.createdAt).toLocaleTimeString('ja-JP', {
            hour: '2-digit', minute: '2-digit', hour12: false,
          }),
          files: [],
        }];
      });
    }

    socket.on('connect',         onConnect);
    socket.on('disconnect',      onDisconnect);
    socket.on('receive_message', onReceiveMessage);

    return () => {
      socket.off('connect',         onConnect);
      socket.off('disconnect',      onDisconnect);
      socket.off('receive_message', onReceiveMessage);
    };
  }, [currentUserId, contactId]);

  /**
   * Gửi tin nhắn văn bản qua socket.
   * @param {string} content
   */
  const sendMessage = useCallback((content) => {
    if (!content?.trim()) return;
    socket.emit('send_message', {
      senderId:   currentUserId,
      receiverId: contactId,
      content:    content.trim(),
      type:       'text',
    });
  }, [currentUserId, contactId]);

  return { messages, setMessages, sendMessage, isConnected };
}
