const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('should return status ok', async () => {
    // Проверяю, что healthcheck возвращает 200 и { status: 'ok' }
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
}); 