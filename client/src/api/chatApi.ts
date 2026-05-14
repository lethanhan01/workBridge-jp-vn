import { apiClient } from './apiClient';

export const chatApi = {
  getConversations: () => {
    const token = localStorage.getItem('token');
    return apiClient('/chat/conversations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getMessages: (roomId: string) => {
    const token = localStorage.getItem('token');
    return apiClient(`/chat/messages/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
