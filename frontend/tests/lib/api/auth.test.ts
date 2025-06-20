import axios from 'axios';
import { authApi } from '@/lib/api/auth';
import { User } from '@/types/auth';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

describe('authApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loginWithYandex должен делать редирект', () => {
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    window.location = { href: '' } as Location;

    authApi.loginWithYandex();
    expect(window.location.href).toBe(`${API_URL}/auth/login`);

    window.location = originalLocation;
  });

  it('logout должен отправлять POST-запрос', async () => {
    mockedAxios.post.mockResolvedValue({});
    await authApi.logout();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
  });

  it('getCurrentUser должен отправлять GET-запрос и возвращать пользователя', async () => {
    const mockUser: User = { name: 'Test User', email: 'test@test.com', role: 'user' };
    mockedAxios.get.mockResolvedValue({ data: mockUser });

    const user = await authApi.getCurrentUser();

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/auth/me`, {
      withCredentials: true,
    });
    expect(user).toEqual(mockUser);
  });
}); 