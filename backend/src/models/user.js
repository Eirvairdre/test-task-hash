// Импорт подключения к базе данных
const pool = require('./db');

// Модель пользователя с основными методами работы с БД
const User = {
  // Поиск пользователя по email
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },
  // Создание нового пользователя
  async create({ email, name }) {
    const [result] = await pool.query('INSERT INTO users (email, name) VALUES (?, ?)', [email, name]);
    return { id: result.insertId, email, name };
  },
  // Поиск пользователя по ID
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }
};

module.exports = User; 