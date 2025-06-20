import axios from 'axios';
import { auditApi } from '@/lib/api/audit';
import { AuditLog } from '@/types/audit';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

describe('auditApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getLogs должен отправлять GET-запрос с параметрами пагинации', async () => {
    const mockLogs: AuditLog[] = [];
    const mockResponse = { logs: mockLogs, total: 0 };
    mockedAxios.get.mockResolvedValue({ data: mockResponse });

    const response = await auditApi.getLogs(0, 25);

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/audit`, {
      params: { page: 0, limit: 25 },
      withCredentials: true,
    });
    expect(response).toEqual(mockResponse);
  });

  it('deleteLog должен отправлять DELETE-запрос с ID', async () => {
    mockedAxios.delete.mockResolvedValue({});
    await auditApi.deleteLog(123);
    expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_URL}/audit/123`, {
      withCredentials: true,
    });
  });

  it('deleteAllLogs должен отправлять DELETE-запрос с подтверждением', async () => {
    mockedAxios.delete.mockResolvedValue({});
    await auditApi.deleteAllLogs();
    expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_URL}/audit`, {
      params: { confirm: 'yes' },
      withCredentials: true,
    });
  });
}); 