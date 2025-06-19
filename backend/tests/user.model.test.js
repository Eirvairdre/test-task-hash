// Импорт тестируемой модели пользователя
const User = require('../src/models/user');

// Мок подключения к базе данных
jest.mock('../src/models/db', () => {
  return {
    query: jest.fn()
  };
});
const pool = require('../src/models/db');

// Тесты модели пользователя
describe('User model', () => {
  // Очистка моков после каждого теста
  afterEach(() => jest.clearAllMocks());

  // Тест поиска пользователя по email с успешным результатом
  it('findByEmail возвращает пользователя, если найден', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, email: 'test@mail.com', name: 'Test' }]]);
    const user = await User.findByEmail('test@mail.com');
    expect(user).toEqual({ id: 1, email: 'test@mail.com', name: 'Test' });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?', ['test@mail.com']);
  });

  // Тест поиска пользователя по email с отрицательным результатом
  it('findByEmail возвращает null, если не найден', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const user = await User.findByEmail('none@mail.com');
    expect(user).toBeNull();
  });

  // Тест создания нового пользователя
  it('create создаёт пользователя', async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 2 }]);
    const user = await User.create({ email: 'new@mail.com', name: 'New' });
    expect(user).toEqual({ id: 2, email: 'new@mail.com', name: 'New' });
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO users (email, name) VALUES (?, ?)', ['new@mail.com', 'New']);
  });

  // Тест поиска пользователя по ID с успешным результатом
  it('findById возвращает пользователя, если найден', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 3, email: 'id@mail.com', name: 'ById' }]]);
    const user = await User.findById(3);
    expect(user).toEqual({ id: 3, email: 'id@mail.com', name: 'ById' });
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [3]);
  });

  // Тест поиска пользователя по ID с отрицательным результатом
  it('findById возвращает null, если не найден', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const user = await User.findById(99);
    expect(user).toBeNull();
  });
}); 