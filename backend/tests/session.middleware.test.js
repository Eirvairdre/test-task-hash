jest.mock('../src/models/session', () => ({
  findByToken: jest.fn()
}));
jest.mock('../src/models/user', () => ({
  findById: jest.fn()
}));
const sessionMiddleware = require('../src/middlewares/session');
const Session = require('../src/models/session');
const User = require('../src/models/user');

describe('session middleware', () => {
  let req, res, next;
  beforeEach(() => {
    req = { cookies: { session_token: 'abc' } };
    res = {};
    next = jest.fn();
  });
  afterEach(() => jest.clearAllMocks());

  it('ставит req.user и req.session, если сессия и пользователь найдены', async () => {
    // Всё найдено — req.user и req.session заполняются
    Session.findByToken.mockResolvedValueOnce({ user_id: 1, expires_at: new Date(Date.now() + 10000) });
    User.findById.mockResolvedValueOnce({ id: 1, email: 'a@b' });
    await sessionMiddleware(req, res, next);
    expect(req.user).toEqual({ id: 1, email: 'a@b' });
    expect(req.session).toEqual({ user_id: 1, expires_at: expect.any(Date) });
    expect(next).toHaveBeenCalled();
  });

  it('ставит req.user = null, если нет токена', async () => {
    // Нет куки — req.user = null
    req.cookies = {};
    await sessionMiddleware(req, res, next);
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  it('ставит req.user = null, если сессия не найдена', async () => {
    // Нет сессии — req.user = null
    Session.findByToken.mockResolvedValueOnce(null);
    await sessionMiddleware(req, res, next);
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  it('ставит req.user = null, если сессия истекла', async () => {
    // Сессия просрочена — req.user = null
    Session.findByToken.mockResolvedValueOnce({ user_id: 1, expires_at: new Date(Date.now() - 10000) });
    await sessionMiddleware(req, res, next);
    expect(req.user).toBeNull();
    expect(next).toHaveBeenCalled();
  });
}); 