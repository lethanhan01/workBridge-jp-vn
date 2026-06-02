import { apiClient } from './apiClient';

export const dictionaryApi = {
  getAll: () => apiClient('/dictionary'),
  toggleFavorite: (id: string) => apiClient(`/dictionary/favorites/${id}/toggle`, { method: 'POST' }),
};
