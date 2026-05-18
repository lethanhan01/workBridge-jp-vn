import { apiClient } from './apiClient';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const chatApi = {
  getConversations: () =>
    apiClient('/chat/conversations', { headers: getAuthHeader() }),

  getMessages: (roomId: string) =>
    apiClient(`/chat/messages/${roomId}`, { headers: getAuthHeader() }),

  // Lấy danh sách user để hiển thị trong dialog
  getUsers: () =>
    apiClient('/chat/users', { headers: getAuthHeader() }),

  // Tạo cuộc hội thoại mới với 1 người
  createConversation: (maNguoiDungKia: string) =>
    apiClient('/chat/conversations', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ maNguoiDungKia }),
    }),
};