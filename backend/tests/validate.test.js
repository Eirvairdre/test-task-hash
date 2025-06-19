const { validateInput } = require('../src/routes/hash');

describe('validateInput', () => {
  it('валидная строка', () => {
    // Ожидаю null для обычной строки
    expect(validateInput('test')).toBeNull();
  });
  it('пустая строка', () => {
    // Пустая строка — ошибка
    expect(validateInput('')).toBe('Строка пуста');
  });
  it('слишком длинная строка', () => {
    // Проверяю ограничение длины
    expect(validateInput('a'.repeat(501))).toBe('Слишком длинная строка');
  });
  it('строка с недопустимыми символами', () => {
    // Проверяю фильтр на спецсимволы
    expect(validateInput('test;')).toBe('Недопустимые символы');
    expect(validateInput('test"')).toBe('Недопустимые символы');
    expect(validateInput("test'")).toBe('Недопустимые символы');
    expect(validateInput('test\\')).toBe('Недопустимые символы');
  });
}); 