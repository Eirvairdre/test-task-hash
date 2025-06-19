// Импорт функции хеширования
const { hashString } = require('../src/utils/hash');

// Тесты функции хеширования строк
describe('hashString', () => {
  // Проверка корректности хеширования MD5
  it('md5', () => {
    expect(hashString('hello', 'md5')).toBe('5d41402abc4b2a76b9719d911017c592');
  });
  // Проверка корректности хеширования SHA1
  it('sha1', () => {
    expect(hashString('hello', 'sha1')).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });
  // Проверка корректности хеширования SHA256
  it('sha256', () => {
    expect(hashString('hello', 'sha256')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
  // Проверка обработки неподдерживаемого алгоритма
  it('ошибка на неподдерживаемом алгоритме', () => {
    expect(() => hashString('hello', 'sha512')).toThrow('Неподдерживаемый алгоритм');
  });
}); 