import axios from 'axios';
import { hashApi } from '@/lib/api/hash';
import { HashRequest, HashResponse } from '@/types/hash';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

describe('hashApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('hashString должен отправлять POST-запрос с правильными данными', async () => {
    const request: HashRequest = { str: 'test', algo: 'sha256' };
    const mockResponse: HashResponse = { hash: 'hashed_string' };

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const response = await hashApi.hashString(request);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API_URL}/hash`,
      request,
      { withCredentials: true }
    );
    expect(response).toEqual(mockResponse);
  });
}); 