// Тесты middleware авторизации и проверки прав
describe('auth middlewares', () => {
  let requireAuth, requireAdmin, getRole;
  // Настройка окружения перед каждым тестом
  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'admin@a,admin@b';  // Список тестовых админов
    jest.resetModules();
    ({ requireAuth, requireAdmin, getRole } = require('../src/middlewares/auth'));
  });

  // Тесты middleware проверки аутентификации
  describe('requireAuth', () => {
    // Проверка пропуска авторизованного пользователя
    it('пропускает, если есть req.user', () => {
      const req = { user: { email: 'a@b' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAuth(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    // Проверка блокировки неавторизованного пользователя
    it('отдаёт 401, если нет req.user', () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAuth(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Требуется аутентификация' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  // Тесты middleware проверки прав администратора
  describe('requireAdmin', () => {
    // Проверка пропуска администратора
    it('пропускает, если email в списке админов', () => {
      const req = { user: { email: 'admin@a' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAdmin(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    // Проверка блокировки неавторизованного пользователя
    it('отдаёт 403, если нет req.user', () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Доступ только для администратора' });
      expect(next).not.toHaveBeenCalled();
    });
    // Проверка блокировки обычного пользователя
    it('отдаёт 403, если email не админ', () => {
      const req = { user: { email: 'user@c' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Доступ только для администратора' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  // Тесты функции определения роли пользователя
  describe('getRole', () => {
    // Проверка определения роли администратора
    it('возвращает admin для email из списка', () => {
      expect(getRole('admin@a')).toBe('admin');
    });
    // Проверка определения роли обычного пользователя
    it('возвращает user для остальных', () => {
      expect(getRole('user@c')).toBe('user');
    });
  });
}); 