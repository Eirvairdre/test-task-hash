import axios from 'axios';
import { AuditLog } from '@/types/audit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const auditApi = {
  // Получить логи с пагинацией
  getLogs: async (page: number, limit: number): Promise<{ logs: AuditLog[], total: number }> => {
    const { data } = await axios.get(`${API_URL}/audit`, {
      params: { page, limit },
      withCredentials: true,
    });
    return data;
  },

  // Удалить лог по ID
  deleteLog: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/audit/${id}`, { withCredentials: true });
  },

  // Удалить все логи
  deleteAllLogs: async (): Promise<void> => {
    await axios.delete(`${API_URL}/audit`, {
      params: { confirm: 'yes' },
      withCredentials: true,
    });
  },
};