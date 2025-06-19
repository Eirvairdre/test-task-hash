// Импорт подключения к базе данных
const pool = require('./db');

// Модель для работы с сессиями пользователей
const Session = {
  // Создать новую сессию
  async create({ user_id, session_token, expires_at }) {
    const [result] = await pool.query(
      'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
      [user_id, session_token, expires_at]
    );
    return { id: result.insertId, user_id, session_token, expires_at };
  },
  // Найти сессию по токену
  async findByToken(session_token) {
    const [rows] = await pool.query('SELECT * FROM sessions WHERE session_token = ?', [session_token]);
    return rows[0] || null;
  },
  // Удалить сессию по токену
  async deleteByToken(session_token) {
    await pool.query('DELETE FROM sessions WHERE session_token = ?', [session_token]);
  }
};

module.exports = Session; 