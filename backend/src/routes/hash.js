const express = require('express');
const { hashWrap } = require('../utils/hashWrap');
const { requireAuth } = require('../middlewares/auth');
const rateLimit = require('../middlewares/rateLimit');
const AuditLog = require('../models/auditLog');

const router = express.Router();

// Список поддерживаемых алгоритмов
const ALGORITHMS = ['md5', 'sha1', 'sha256'];

// Проверка строки на валидность (пустая, слишком длинная, спецсимволы)
function validateInput(str) {
  if (typeof str !== 'string' || !str.trim()) return 'Строка пуста';
  if (str.length > 500) return 'Слишком длинная строка';
  if (/['";\\]/.test(str)) return 'Недопустимые символы';
  return null;
}

// POST /api/hash — принимает строку и алгоритм, возвращает хеш, пишет в аудит-лог
router.post('/', requireAuth, rateLimit, async (req, res) => {
  const { str, algo } = req.body;
  const error = validateInput(str);
  if (error) {
    // Ошибка валидации — пишу в аудит и отдаю 400
    await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'hash_error', details: error, is_error: true });
    return res.status(400).json({ error });
  }
  if (!ALGORITHMS.includes(algo)) {
    // Неподдерживаемый алгоритм — тоже аудит и 400
    await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'hash_error', details: 'Неподдерживаемый алгоритм', is_error: true });
    return res.status(400).json({ error: 'Неподдерживаемый алгоритм' });
  }
  try {
    // Всё ок — считаю хеш, пишу в аудит, возвращаю результат
    const hash = hashWrap(str, algo);
    await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'hash', details: `algo: ${algo}` });
    const warning = res.get('X-RateLimit-Warning');
    res.json({ hash, warning });
  } catch (e) {
    // Ошибка хеширования — аудит и 500
    await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'hash_error', details: e.message, is_error: true });
    res.status(500).json({ error: 'Ошибка хеширования' });
  }
});

module.exports = router;
module.exports.validateInput = validateInput; 