const request = require('supertest');
const express = require('express');
const AuditLog = require('../src/models/auditLog');

// Мокаем модель AuditLog
jest.mock('../src/models/auditLog');

const app = express();
app.use(express.json());

const mockAdmin = {
  id: 1,
  email: 'admin@test.com',
  role: 'admin'
};

// Мокаем middleware для аутентификации
app.use((req, res, next) => {
  req.user = mockAdmin;
  next();
});

// Получить аудит-логи с пагинацией (только для админа)
app.get('/api/audit', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const logs = await AuditLog.getAll({ limit, offset });
  const total = await AuditLog.count();
  res.json({ logs, total, page, pages: Math.ceil(total / limit) });
});

// Удалить один лог по id (только для админа)
app.delete('/api/audit/:id', async (req, res) => {
  await AuditLog.deleteById(req.params.id);
  res.json({ ok: true });
});

// Очистить все логи (только для админа, с подтверждением)
app.delete('/api/audit', async (req, res) => {
  if (req.query.confirm !== 'yes') {
    return res.status(400).json({ error: 'Требуется подтверждение ?confirm=yes' });
  }
  await AuditLog.deleteAll();
  res.json({ ok: true });
});

describe('Audit Routes', () => {
  const mockLogs = [
    { id: 1, user_id: 1, action: 'test1' },
    { id: 2, user_id: 1, action: 'test2' }
  ];

  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
    // Устанавливаем переменную окружения с админами
    process.env.ADMIN_EMAILS = 'admin@test.com';
    // Мокаем методы AuditLog по умолчанию
    AuditLog.getAll.mockResolvedValue(mockLogs);
    AuditLog.count.mockResolvedValue(10);
    AuditLog.deleteById.mockResolvedValue();
    AuditLog.deleteAll.mockResolvedValue();
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  describe('GET /', () => {
    it('должен получить список логов с пагинацией', async () => {
      const response = await request(app)
        .get('/api/audit')
        .expect(200);

      expect(response.body).toEqual({
        logs: mockLogs,
        total: 10,
        page: 1,
        pages: 1
      });
      expect(AuditLog.getAll).toHaveBeenCalledWith({ limit: 20, offset: 0 });
    });

    it('должен использовать параметры пагинации из запроса', async () => {
      AuditLog.count.mockResolvedValue(100);

      const response = await request(app)
        .get('/api/audit?page=2&limit=50')
        .expect(200);

      expect(response.body.page).toBe(2);
      expect(response.body.pages).toBe(2);
      expect(AuditLog.getAll).toHaveBeenCalledWith({ limit: 50, offset: 50 });
    });
  });

  describe('DELETE /:id', () => {
    it('должен удалить лог по id', async () => {
      await request(app)
        .delete('/api/audit/1')
        .expect(200);

      expect(AuditLog.deleteById).toHaveBeenCalledWith('1');
    });
  });

  describe('DELETE /', () => {
    it('должен требовать подтверждение для удаления всех логов', async () => {
      await request(app)
        .delete('/api/audit')
        .expect(400);

      expect(AuditLog.deleteAll).not.toHaveBeenCalled();
    });

    it('должен удалить все логи при наличии подтверждения', async () => {
      await request(app)
        .delete('/api/audit?confirm=yes')
        .expect(200);

      expect(AuditLog.deleteAll).toHaveBeenCalled();
    });
  });
}); 