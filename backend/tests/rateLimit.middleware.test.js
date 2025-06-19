const rateLimit = require('../src/middlewares/rateLimit');

describe('rateLimit middleware', () => {
  let req, res, next;
  beforeEach(() => {
    req = { user: { email: 'test@mail.com' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), set: jest.fn() };
    next = jest.fn();
    rateLimit.__getUserRequests().clear();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('пропускает, если лимит не превышен', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit(req, res, next);
    }
    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(5);
  });

  it('отдаёт 429, если лимит превышен', () => {
    for (let i = 0; i < 31; i++) {
      rateLimit(req, res, next);
    }
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ error: 'Слишком много запросов. Лимит 30 в минуту.' });
  });

  it('выставляет предупреждение, если запросы слишком частые', () => {
    // Первый запрос — текущее время
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValueOnce(now);
    rateLimit(req, res, next);
    // Второй запрос — через 1 секунду (меньше 2 секунд)
    jest.spyOn(Date, 'now').mockReturnValueOnce(now + 1000);
    rateLimit(req, res, next);
    expect(res.set).toHaveBeenCalledWith('X-RateLimit-Warning', 'Не чаще 1 раза в 2 секунды!');
  });
}); 