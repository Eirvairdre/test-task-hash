const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const crypto = require('crypto');
const User = require('../src/models/user');
const Session = require('../src/models/session');
const AuditLog = require('../src/models/auditLog');
const { getRole } = require('../src/middlewares/auth');
const authRouter = require('../src/routes/auth');

// Мокаем axios
jest.mock('axios');

// Мокаем crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({ toString: () => 'mock-session-token' })),
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('mock-hash')
  }))
}));

// Мокаем getRole
jest.mock('../src/middlewares/auth', () => ({
  getRole: jest.fn().mockReturnValue('user')
}));

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
    
    // Создаем тестовое приложение
    app = express();
    app.use(cookieParser());
    app.use((req, res, next) => {
      req.cookies = req.cookies || {};
      next();
    });
    app.use('/auth', authRouter);
  });

  describe('GET /auth/login', () => {
    it('should redirect to Yandex OAuth page', async () => {
      const response = await request(app).get('/auth/login');
      expect(response.status).toBe(302);
      expect(response.header.location).toContain('https://oauth.yandex.ru/authorize');
      expect(response.header.location).toContain('response_type=code');
    }, 10000);
  });

  describe('GET /auth/callback/yandex', () => {
    it('should handle successful OAuth callback', async () => {
      // Мокаем успешные ответы от API Яндекса
      axios.post.mockResolvedValueOnce({
        data: { access_token: 'mock-access-token' }
      });
      axios.get.mockResolvedValueOnce({
        data: { default_email: 'test@example.com', real_name: 'Test User' }
      });

      // Мокаем методы моделей
      User.findByEmail = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' });
      Session.create = jest.fn().mockResolvedValue({});
      AuditLog.create = jest.fn().mockResolvedValue({});

      const response = await request(app)
        .get('/auth/callback/yandex')
        .query({ code: 'test-code' });

      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/');
      expect(response.header['set-cookie']).toBeDefined();
      expect(response.header['set-cookie'][0]).toContain('session_token=mock-session-token');
      
      // Проверяем, что все методы были вызваны
      expect(axios.post).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalled();
      expect(User.create).toHaveBeenCalled();
      expect(Session.create).toHaveBeenCalled();
      expect(AuditLog.create).toHaveBeenCalled();
    }, 10000);

    it('should handle missing code parameter', async () => {
      const response = await request(app)
        .get('/auth/callback/yandex');
      
      expect(response.status).toBe(400);
      expect(response.text).toBe('Нет кода авторизации');
    }, 10000);

    it('should handle API errors', async () => {
      axios.post.mockRejectedValueOnce(new Error('API Error'));
      AuditLog.create = jest.fn().mockResolvedValue({});

      const response = await request(app)
        .get('/auth/callback/yandex')
        .query({ code: 'test-code' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Ошибка авторизации');
      expect(AuditLog.create).toHaveBeenCalledWith({
        user_id: null,
        email: null,
        action: 'login_error',
        details: 'API Error',
        is_error: true
      });
    }, 10000);
  });

  describe('POST /auth/logout', () => {
    it('should handle successful logout', async () => {
      // Мокаем методы
      Session.deleteByToken = jest.fn().mockResolvedValue({});
      AuditLog.create = jest.fn().mockResolvedValue({});

      const response = await request(app)
        .post('/auth/logout')
        .set('Cookie', ['session_token=test-token'])
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
      expect(Session.deleteByToken).toHaveBeenCalledWith('test-token');
      expect(response.header['set-cookie'][0]).toContain('session_token=;');
    }, 10000);

    it('should handle logout without session token', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true });
    }, 10000);
  });

  describe('GET /auth/me', () => {
    it('should return user info for authenticated user', async () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
      };

      // Создаем новое приложение с пользователем
      app = express();
      app.use(cookieParser());
      app.use((req, res, next) => {
        req.user = mockUser;
        next();
      });
      app.use('/auth', authRouter);

      const response = await request(app)
        .get('/auth/me');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        email: mockUser.email,
        name: mockUser.name,
        role: 'user'
      });
    }, 10000);

    it('should return 401 for unauthenticated user', async () => {
      // Создаем новое приложение без пользователя
      app = express();
      app.use(cookieParser());
      app.use('/auth', authRouter);

      const response = await request(app)
        .get('/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Не авторизован' });
    }, 10000);
  });
}); 