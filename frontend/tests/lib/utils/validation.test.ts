import { validateHashString } from '@/lib/utils/validation';

describe('validateHashString', () => {
  it('возвращает ошибку для пустой строки', () => {
    expect(validateHashString('')).toBe('Строка не может быть пустой');
    expect(validateHashString('   ')).toBe('Строка не может быть пустой');
  });

  it('возвращает ошибку для строки с SQL-инъекцией', () => {
    expect(validateHashString("test; DROP TABLE users;")).toBe('Недопустимые символы в строке');
    expect(validateHashString("select * from users")).toBe('Недопустимые символы в строке');
    expect(validateHashString("admin' OR 1=1 --")).toBe('Недопустимые символы в строке');
  });

  it('возвращает null для валидной строки', () => {
    expect(validateHashString('hello world')).toBeNull();
    expect(validateHashString('123456')).toBeNull();
    expect(validateHashString('тестовая строка')).toBeNull();
  });
}); 