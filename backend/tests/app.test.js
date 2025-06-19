// Импорт библиотеки для тестирования HTTP и приложения
const request = require('supertest');
const app = require('../src/app');

// Тесты эндпоинта проверки работоспособности сервера
describe('GET /health', () => {
  // Проверка успешного ответа от сервера
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
}); 