import { apiClient } from './apiClient';

export const authApi = {
  login: (credentials: any) => apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  signup: (userData: any) => apiClient('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};
