const request = require('supertest');

const validCookie = 'session_token=valid_token';

// Для моков app после doMock
const getApp = () => require('../src/app');

describe('POST /api/hash', () => {
  beforeEach(() => {
    // Очищаю Map rate limit перед каждым тестом
    require('../src/middlewares/rateLimit').__getUserRequests().clear();
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('401 без авторизации', async () => {
    // Нет пользователя — должен быть 401
    const app = getApp();
    const res = await request(app)
      .post('/api/hash')
      .send({ str: 'test', algo: 'md5' });
    expect(res.status).toBe(401);
  });

  it('400 при пустой строке', async () => {
    jest.doMock('../src/models/auditLog', () => ({ create: jest.fn() }));
    jest.doMock('../src/middlewares/session', () => (req, res, next) => {
      req.user = { id: 1, email: 'user@mail.com', name: 'User' };
      next();
    });
    // Проверяю ошибку на пустую строку
    const app = getApp();
    const res = await request(app)
      .post('/api/hash')
      .set('Cookie', validCookie)
      .send({ str: '', algo: 'md5' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Строка пуста');
  });

  it('400 при слишком длинной строке', async () => {
    jest.doMock('../src/models/auditLog', () => ({ create: jest.fn() }));
    jest.doMock('../src/middlewares/session', () => (req, res, next) => {
      req.user = { id: 1, email: 'user@mail.com', name: 'User' };
      next();
    });
    // Проверяю ограничение длины
    const app = getApp();
    const res = await request(app)
      .post('/api/hash')
      .set('Cookie', validCookie)
      .send({ str: 'a'.repeat(501), algo: 'md5' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Слишком длинная строка');
  });

  it('400 при недопустимых символах', async () => {
    jest.doMock('../src/models/auditLog', () => ({ create: jest.fn() }));
    jest.doMock('../src/middlewares/session', () => (req, res, next) => {
      req.user = { id: 1, email: 'user@mail.com', name: 'User' };
      next();
    });
    // Проверяю фильтр на спецсимволы
    const app = getApp();
    const res = await request(app)
      .post('/api/hash')
      .set('Cookie', validCookie)
      .send({ str: 'test;', algo: 'md5' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Недопустимые символы');
  });

  it('400 при неподдерживаемом алгоритме', async () => {
    jest.doMock('../src/models/auditLog', () => ({ create: jest.fn() }));
    jest.doMock('../src/middlewares/session', () => (req, res, next) => {
      req.user = { id: 1, email: 'user@mail.com', name: 'User' };
      next();
    });
    // Алгоритм не из списка — 400
    const app = getApp();
    const res = await request(app)
      .post('/api/hash')
      .set('Cookie', validCookie)
      .send({ str: 'test', algo: 'sha512' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Неподдерживаемый алгоритм');
  });

  it('200 и правильный хеш при валидных данных', async () => {
    jest.doMock('../src/models/auditLog', () => ({ create: jest.fn() }));
    jest.doMock('../src/middlewares/session', () => (req, res, next) => {
      req.user = { id: 1, email: 'user@mail.com', name: 'User' };
      next();
    });
    // Обычный успешный кейс
    const app = getApp();
    const res = await request(app)
      .post('/api/hash')
      .set('Cookie', validCookie)
      .send({ str: 'hello', algo: 'md5' });
    expect(res.status).toBe(200);
    expect(res.body.hash).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('500 при ошибке хеширования', async () => {
    jest.doMock('../src/models/auditLog', () => ({ create: jest.fn() }));
    jest.doMock('../src/middlewares/session', () => (req, res, next) => {
      req.user = { id: 1, email: 'user@mail.com', name: 'User' };
      next();
    });
    // Мокаю функцию hashWrap, чтобы она кидала ошибку
    jest.doMock('../src/utils/hashWrap', () => ({ hashWrap: () => { throw new Error('fail'); } }));
    const app = getApp();
    const res = await request(app)
      .post('/api/hash')
      .set('Cookie', validCookie)
      .send({ str: 'hello', algo: 'md5' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Ошибка хеширования');
  });
}); 