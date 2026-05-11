import { authApi } from '../api/authApi';

export const login = async (data) => {
  const response = await fetch(authApi.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Lỗi kết nối máy chủ');
  }
  
  return result;
};
