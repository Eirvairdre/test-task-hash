const crypto = require('crypto');

// Поддерживаемые алгоритмы хеширования
const ALGORITHMS = ['md5', 'sha1', 'sha256'];

// Хеширует строку выбранным алгоритмом
function hashString(str, algo) {
  if (!ALGORITHMS.includes(algo)) throw new Error('Неподдерживаемый алгоритм');
  return crypto.createHash(algo).update(str).digest('hex');
}

module.exports = { hashString, ALGORITHMS }; 