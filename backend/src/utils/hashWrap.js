const crypto = require('crypto');

// Враппер для хеширования строки выбранным алгоритмом (используется для моков в тестах)
function hashWrap(str, algo) {
  return crypto.createHash(algo).update(str).digest('hex');
}

module.exports = { hashWrap }; 