// Импорт тестируемой функции хеширования
const { hashWrap } = require('../src/utils/hashWrap');

// Тесты функции-обертки для хеширования
describe('hashWrap', () => {
  // Тест хеширования MD5
  it('должен корректно хешировать строку с помощью md5', () => {
    const result = hashWrap('test', 'md5');
    expect(result).toBe('098f6bcd4621d373cade4e832627b4f6');
  });

  // Тест хеширования SHA1
  it('должен корректно хешировать строку с помощью sha1', () => {
    const result = hashWrap('test', 'sha1');
    expect(result).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
  });

  // Тест хеширования SHA256
  it('должен корректно хешировать строку с помощью sha256', () => {
    const result = hashWrap('test', 'sha256');
    expect(result).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  // Тест хеширования пустой строки
  it('должен корректно хешировать пустую строку', () => {
    const result = hashWrap('', 'md5');
    expect(result).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  // Тест обработки неподдерживаемого алгоритма
  it('должен выбрасывать ошибку при неверном алгоритме', () => {
    expect(() => {
      hashWrap('test', 'invalid');
    }).toThrow();
  });
}); 