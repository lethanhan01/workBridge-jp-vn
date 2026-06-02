import { apiClient } from './apiClient';

export const userApi = {
  getProfile: () => apiClient('/users/profile'),
  updateProfile: (data: { ten?: string; email?: string; ma_ngon_ngu?: string; matkhau?: string; phong_ban?: string; chuc_vu?: string; input_language?: string }) => 
    apiClient('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getAllUsers: () => apiClient('/users'),
  getUserById: (id: string) => apiClient(`/users/${id}`),
  updateUserAdmin: (id: string, data: { phong_ban?: string; chuc_vu?: string; role?: string; input_language?: string }) =>
    apiClient(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  createUser: (data: any) =>
    apiClient('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
