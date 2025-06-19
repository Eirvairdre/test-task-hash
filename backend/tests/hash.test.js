const { hashString } = require('../src/utils/hash');

describe('hashString', () => {
  it('md5', () => {
    // Проверяю, что md5("hello") возвращает правильный хеш
    expect(hashString('hello', 'md5')).toBe('5d41402abc4b2a76b9719d911017c592');
  });
  it('sha1', () => {
    // Проверяю sha1
    expect(hashString('hello', 'sha1')).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });
  it('sha256', () => {
    // Проверяю sha256
    expect(hashString('hello', 'sha256')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
  it('ошибка на неподдерживаемом алгоритме', () => {
    // Если алгоритм не поддерживается — должна быть ошибка
    expect(() => hashString('hello', 'sha512')).toThrow('Неподдерживаемый алгоритм');
  });
}); 