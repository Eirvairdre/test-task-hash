const pool = require('./db');

// Модель для работы с аудит-логами (журнал действий пользователей)
const AuditLog = {
  // Записать событие в аудит-лог
  async create({ user_id, email, action, details, is_error = false }) {
    await pool.query(
      'INSERT INTO audit_logs (user_id, email, action, details, is_error) VALUES (?, ?, ?, ?, ?)',
      [user_id, email, action, details, is_error]
    );
  },
  // Получить список логов с пагинацией
  async getAll({ limit = 20, offset = 0 } = {}) {
    const [rows] = await pool.query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  },
  // Удалить лог по id
  async deleteById(id) {
    await pool.query('DELETE FROM audit_logs WHERE id = ?', [id]);
  },
  // Удалить все логи
  async deleteAll() {
    await pool.query('DELETE FROM audit_logs');
  },
  // Получить количество логов
  async count() {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM audit_logs');
    return rows[0].count;
  }
};

module.exports = AuditLog; 