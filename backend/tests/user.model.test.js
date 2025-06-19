const User = require('../src/models/user');

jest.mock('../src/models/db', () => {
  return {
    query: jest.fn()
  };
});
const pool = require('../src/models/db');

describe('User model', () => {
  afterEach(() => jest.clearAllMocks());

  it('findByEmail возвращает пользователя, если найден', async () => {
    // Пользователь найден по email
    pool.query.mockResolvedValueOnce([[{ id: 1, email: 'test@mail.com', name: 'Test' }]]);
    const user = await User.findByEmail('test@mail.com');
    expect(user).toEqual({ id: 1, email: 'test@mail.com', name: 'Test' });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['test@mail.com']);
  });

  it('findByEmail возвращает null, если не найден', async () => {
    // Нет такого пользователя
    pool.query.mockResolvedValueOnce([[]]);
    const user = await User.findByEmail('none@mail.com');
    expect(user).toBeNull();
  });

  it('create создаёт пользователя', async () => {
    // Проверяю создание пользователя
    pool.query.mockResolvedValueOnce([{ insertId: 2 }]);
    const user = await User.create({ email: 'new@mail.com', name: 'New' });
    expect(user).toEqual({ id: 2, email: 'new@mail.com', name: 'New' });
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO users (email, name) VALUES (?, ?)', ['new@mail.com', 'New']);
  });

  it('findById возвращает пользователя, если найден', async () => {
    // Пользователь найден по id
    pool.query.mockResolvedValueOnce([[{ id: 3, email: 'id@mail.com', name: 'ById' }]]);
    const user = await User.findById(3);
    expect(user).toEqual({ id: 3, email: 'id@mail.com', name: 'ById' });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [3]);
  });

  it('findById возвращает null, если не найден', async () => {
    // Нет такого пользователя по id
    pool.query.mockResolvedValueOnce([[]]);
    const user = await User.findById(99);
    expect(user).toBeNull();
  });
}); 