import axios from 'axios';
import { HashRequest, HashResponse } from '@/types/hash';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const hashApi = {
  // Хеширование строки
  hashString: async (request: HashRequest): Promise<HashResponse> => {
    const { data } = await axios.post(`${API_URL}/hash`, request, { withCredentials: true });
    return data;
  },
}; 