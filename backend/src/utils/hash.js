// Импорт встроенного модуля для криптографии
const crypto = require('crypto');

// Список поддерживаемых алгоритмов хеширования
const ALGORITHMS = ['md5', 'sha1', 'sha256'];

// Хеширует строку выбранным алгоритмом
// str - строка для хеширования
// algo - алгоритм (md5, sha1, sha256)
function hashString(str, algo) {
  if (!ALGORITHMS.includes(algo)) throw new Error('Неподдерживаемый алгоритм');
  return crypto.createHash(algo).update(str).digest('hex');
}

module.exports = { hashString, ALGORITHMS }; 