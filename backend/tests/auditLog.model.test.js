const AuditLog = require('../src/models/auditLog');

jest.mock('../src/models/db', () => {
  return {
    query: jest.fn()
  };
});
const pool = require('../src/models/db');

describe('AuditLog model', () => {
  afterEach(() => jest.clearAllMocks());

  it('create пишет лог', async () => {
    // Проверяю запись лога
    pool.query.mockResolvedValueOnce();
    await AuditLog.create({ user_id: 1, email: 'a@b', action: 'test', details: 'ok', is_error: false });
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO audit_logs (user_id, email, action, details, is_error) VALUES (?, ?, ?, ?, ?)',
      [1, 'a@b', 'test', 'ok', false]
    );
  });

  it('getAll возвращает логи', async () => {
    // Получаю список логов
    pool.query.mockResolvedValueOnce([[{ id: 1 }, { id: 2 }]]);
    const logs = await AuditLog.getAll({ limit: 2, offset: 0 });
    expect(logs).toEqual([{ id: 1 }, { id: 2 }]);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [2, 0]
    );
  });

  it('deleteById удаляет лог', async () => {
    // Удаляю лог по id
    pool.query.mockResolvedValueOnce();
    await AuditLog.deleteById(5);
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM audit_logs WHERE id = ?', [5]);
  });

  it('deleteAll удаляет все логи', async () => {
    // Удаляю все логи
    pool.query.mockResolvedValueOnce();
    await AuditLog.deleteAll();
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM audit_logs');
  });

  it('count возвращает количество логов', async () => {
    // Получаю количество логов
    pool.query.mockResolvedValueOnce([[{ count: 42 }]]);
    const count = await AuditLog.count();
    expect(count).toBe(42);
    expect(pool.query).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM audit_logs');
  });
}); 