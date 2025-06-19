describe('auth middlewares', () => {
  let requireAuth, requireAdmin, getRole;
  beforeEach(() => {
    process.env.ADMIN_EMAILS = 'admin@a,admin@b';
    jest.resetModules();
    ({ requireAuth, requireAdmin, getRole } = require('../src/middlewares/auth'));
  });

  describe('requireAuth', () => {
    it('пропускает, если есть req.user', () => {
      // Пользователь есть — next вызывается
      const req = { user: { email: 'a@b' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAuth(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('отдаёт 401, если нет req.user', () => {
      // Нет пользователя — 401
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAuth(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Требуется аутентификация' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('пропускает, если email в списке админов', () => {
      // Email есть в списке админов
      const req = { user: { email: 'admin@a' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAdmin(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('отдаёт 403, если нет req.user', () => {
      // Нет пользователя — 403
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Доступ только для администратора' });
      expect(next).not.toHaveBeenCalled();
    });
    it('отдаёт 403, если email не админ', () => {
      // Пользователь не админ — 403
      const req = { user: { email: 'user@c' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      requireAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Доступ только для администратора' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getRole', () => {
    it('возвращает admin для email из списка', () => {
      // Email в списке — роль admin
      expect(getRole('admin@a')).toBe('admin');
    });
    it('возвращает user для остальных', () => {
      // Любой другой email — роль user
      expect(getRole('user@c')).toBe('user');
    });
  });
}); 