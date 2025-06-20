import axios from 'axios';
import { User } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const authApi = {
  // Начать OAuth процесс с Яндексом
  loginWithYandex: () => {
    window.location.href = `${API_URL}/auth/login`;
  },

  // Выход из системы
  logout: async () => {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  },

  // Получить информацию о текущем пользователе
  getCurrentUser: async (): Promise<User> => {
    const { data } = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
    return data;
  },
}; 