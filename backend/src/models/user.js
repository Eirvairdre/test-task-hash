const pool = require('./db');

// Модель для работы с пользователями
const User = {
  // Найти пользователя по email
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },
  // Создать нового пользователя
  async create({ email, name }) {
    const [result] = await pool.query('INSERT INTO users (email, name) VALUES (?, ?)', [email, name]);
    return { id: result.insertId, email, name };
  },
  // Найти пользователя по id
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }
};

module.exports = User; 