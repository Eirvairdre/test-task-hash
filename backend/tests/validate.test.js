// Импорт функции валидации из роута хеширования
const { validateInput } = require('../src/routes/hash');

// Тесты функции валидации входных данных
describe('validateInput', () => {
  // Проверка прохождения валидации для корректной строки
  it('валидная строка', () => {
    expect(validateInput('test')).toBeNull();
  });
  // Проверка обработки пустой строки
  it('пустая строка', () => {
    expect(validateInput('')).toBe('Строка пуста');
  });
  // Проверка ограничения длины строки
  it('слишком длинная строка', () => {
    expect(validateInput('a'.repeat(501))).toBe('Слишком длинная строка');
  });
  // Проверка запрещенных символов (кавычки, точка с запятой, обратный слеш)
  it('строка с недопустимыми символами', () => {
    expect(validateInput('test;')).toBe('Недопустимые символы');
    expect(validateInput('test"')).toBe('Недопустимые символы');
    expect(validateInput("test'")).toBe('Недопустимые символы');
    expect(validateInput('test\\')).toBe('Недопустимые символы');
  });
}); 