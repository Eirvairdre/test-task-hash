// Импорт встроенного модуля для криптографических операций
const crypto = require('crypto');

// Обертка для хеширования строки выбранным алгоритмом
// str - строка для хеширования
// algo - алгоритм хеширования (md5, sha1, sha256)
function hashWrap(str, algo) {
  return crypto.createHash(algo).update(str).digest('hex');
}

module.exports = { hashWrap }; 