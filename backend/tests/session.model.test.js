// Импорт тестируемой модели сессии
const Session = require('../src/models/session');

// Мок подключения к базе данных
jest.mock('../src/models/db', () => {
  return {
    query: jest.fn()
  };
});
const pool = require('../src/models/db');

// Тесты модели сессии
describe('Session model', () => {
  // Очистка моков после каждого теста
  afterEach(() => jest.clearAllMocks());

  // Тест создания новой сессии
  it('create создаёт сессию', async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 10 }]);
    const data = { user_id: 1, session_token: 'abc', expires_at: '2025-01-01' };
    const session = await Session.create(data);
    expect(session).toEqual({ id: 10, ...data });
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
      [1, 'abc', '2025-01-01']
    );
  });

  // Тест поиска сессии по токену с успешным результатом
  it('findByToken возвращает сессию, если найдена', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, session_token: 'abc' }]]);
    const session = await Session.findByToken('abc');
    expect(session).toEqual({ id: 1, session_token: 'abc' });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM sessions WHERE session_token = ?', ['abc']);
  });

  // Тест поиска сессии по токену с отрицательным результатом
  it('findByToken возвращает null, если не найдена', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const session = await Session.findByToken('none');
    expect(session).toBeNull();
  });

  // Тест удаления сессии по токену
  it('deleteByToken удаляет сессию', async () => {
    pool.query.mockResolvedValueOnce();
    await Session.deleteByToken('abc');
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM sessions WHERE session_token = ?', ['abc']);
  });
}); 