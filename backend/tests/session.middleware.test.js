// Мокаем модели для изоляции тестов
jest.mock('../src/models/session', () => ({
  findByToken: jest.fn()
}));
jest.mock('../src/models/user', () => ({
  findById: jest.fn()
}));

// Импорт тестируемого middleware и моделей
const sessionMiddleware = require('../src/middlewares/session');
const Session = require('../src/models/session');
const User = require('../src/models/user');

// Тесты middleware управления сессиями
describe('session middleware', () => {
  let req, res, next;
  // Подготовка тестового окружения
  beforeEach(() => {
    req = { cookies: { session_token: 'abc' } };
    res = {};
    next = jest.fn();
  });
  // Очистка моков после каждого теста
  afterEach(() => jest.clearAllMocks());

  // Проверка успешной авторизации по сессии
  it('ставит req.user и req.session, если сессия и пользователь найдены', async () => {
    // Мокаем успешный поиск сессии и пользователя
    Session.findByToken.mockResolvedValueOnce({ user_id: 1, expires_at: new Date(Date.now() + 10000) });
    User.findById.mockResolvedValueOnce({ id: 1, email: 'a@b' });
    await sessionMiddleware(req, res, next);
    expect(req.user).toEqual({ id: 1, email: 'a@b' });
    expect(req.session).toEqual({ user_id: 1, expires_at: expect.any(Date) });
    expect(next).toHaveBeenCalled();
  });

  // Проверка отсутствия токена
  it('ставит req.user = null, если нет токена', async () => {
    req.cookies = {};
    await sessionMiddleware(req, res, next);
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  // Проверка отсутствия сессии в БД
  it('ставит req.user = null, если сессия не найдена', async () => {
    Session.findByToken.mockResolvedValueOnce(null);
    await sessionMiddleware(req, res, next);
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  // Проверка истекшей сессии
  it('ставит req.user = null, если сессия истекла', async () => {
    Session.findByToken.mockResolvedValueOnce({ user_id: 1, expires_at: new Date(Date.now() - 10000) });
    await sessionMiddleware(req, res, next);
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });
}); 