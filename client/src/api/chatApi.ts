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

  // Tạo cuộc hội thoại mới (hỗ trợ cả 1-1 và nhóm)
  createConversation: (payload: { maNguoiDungKia?: string; danhSachMaNguoiDung?: string[]; tenCuocHoiThoai?: string }) =>
    apiClient('/chat/conversations', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload),
    }),
};