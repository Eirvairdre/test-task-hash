const Session = require('../src/models/session');

jest.mock('../src/models/db', () => {
  return {
    query: jest.fn()
  };
});
const pool = require('../src/models/db');

describe('Session model', () => {
  afterEach(() => jest.clearAllMocks());

  it('create создаёт сессию', async () => {
    // Проверяю создание сессии
    pool.query.mockResolvedValueOnce([{ insertId: 10 }]);
    const data = { user_id: 1, session_token: 'abc', expires_at: '2025-01-01' };
    const session = await Session.create(data);
    expect(session).toEqual({ id: 10, ...data });
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
      [1, 'abc', '2025-01-01']
    );
  });

  it('findByToken возвращает сессию, если найдена', async () => {
    // Сессия найдена
    pool.query.mockResolvedValueOnce([[{ id: 1, session_token: 'abc' }]]);
    const session = await Session.findByToken('abc');
    expect(session).toEqual({ id: 1, session_token: 'abc' });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM sessions WHERE session_token = ?', ['abc']);
  });

  it('findByToken возвращает null, если не найдена', async () => {
    // Нет такой сессии
    pool.query.mockResolvedValueOnce([[]]);
    const session = await Session.findByToken('none');
    expect(session).toBeNull();
  });

  it('deleteByToken удаляет сессию', async () => {
    // Проверяю удаление по токену
    pool.query.mockResolvedValueOnce();
    await Session.deleteByToken('abc');
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM sessions WHERE session_token = ?', ['abc']);
  });
}); 