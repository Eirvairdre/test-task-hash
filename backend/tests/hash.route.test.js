const request = require('supertest');
const express = require('express');
const { hashWrap } = require('../src/utils/hashWrap');
const AuditLog = require('../src/models/auditLog');

jest.mock('../src/utils/hashWrap');
jest.mock('../src/models/auditLog');

const app = express();
app.use(express.json());

const mockUser = {
  id: 1,
  email: 'user@test.com'
};

// Мокаем middleware для аутентификации
app.use((req, res, next) => {
  req.user = mockUser;
  next();
});

// Мокаем middleware для rate limit
app.use((req, res, next) => {
  if (req.headers['x-ratelimit-warning']) {
    res.set('X-RateLimit-Warning', req.headers['x-ratelimit-warning']);
  }
  next();
});

const ALGORITHMS = ['md5', 'sha1', 'sha256'];

// Проверяем строку на валидность (пустая, слишком длинная, странные символы)
function validateInput(str) {
  if (typeof str !== 'string' || !str.trim()) return 'Строка пуста';
  if (str.length > 500) return 'Слишком длинная строка';
  if (/['";\\]/.test(str)) return 'Недопустимые символы';
  return null;
}

// Основной роут: принимает строку и алгоритм, возвращает хеш и пишет всё в аудит-лог
app.post('/api/hash', async (req, res) => {
  const { str, algo } = req.body;
  const error = validateInput(str);
  if (error) {
    await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'hash_error', details: error, is_error: true });
    return res.status(400).json({ error });
  }
  if (!ALGORITHMS.includes(algo)) {
    await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'hash_error', details: 'Неподдерживаемый алгоритм', is_error: true });
    return res.status(400).json({ error: 'Неподдерживаемый алгоритм' });
  }
  try {
    const hash = hashWrap(str, algo);
    await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'hash', details: `algo: ${algo}` });
    const warning = res.get('X-RateLimit-Warning');
    res.json({ hash, warning });
  } catch (e) {
    await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'hash_error', details: e.message, is_error: true });
    res.status(500).json({ error: 'Ошибка хеширования' });
  }
});

describe('Hash Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Мокаем создание лога по умолчанию
    AuditLog.create.mockResolvedValue();
  });

  describe('POST /', () => {
    it('должен хешировать строку с валидными параметрами', async () => {
      const mockHash = '123abc';
      hashWrap.mockReturnValue(mockHash);

      const response = await request(app)
        .post('/api/hash')
        .send({ str: 'test', algo: 'md5' })
        .expect(200);

      expect(response.body.hash).toBe(mockHash);
      expect(hashWrap).toHaveBeenCalledWith('test', 'md5');
      expect(AuditLog.create).toHaveBeenCalledWith({
        user_id: mockUser.id,
        email: mockUser.email,
        action: 'hash',
        details: 'algo: md5'
      });
    });

    it('должен вернуть ошибку при пустой строке', async () => {
      const response = await request(app)
        .post('/api/hash')
        .send({ str: '', algo: 'md5' })
        .expect(400);

      expect(response.body.error).toBe('Строка пуста');
      expect(AuditLog.create).toHaveBeenCalledWith({
        user_id: mockUser.id,
        email: mockUser.email,
        action: 'hash_error',
        details: 'Строка пуста',
        is_error: true
      });
    });

    it('должен вернуть ошибку при слишком длинной строке', async () => {
      const longString = 'a'.repeat(501);
      const response = await request(app)
        .post('/api/hash')
        .send({ str: longString, algo: 'md5' })
        .expect(400);

      expect(response.body.error).toBe('Слишком длинная строка');
    });

    it('должен вернуть ошибку при недопустимых символах', async () => {
      const response = await request(app)
        .post('/api/hash')
        .send({ str: "test'test", algo: 'md5' })
        .expect(400);

      expect(response.body.error).toBe('Недопустимые символы');
    });

    it('должен вернуть ошибку при неподдерживаемом алгоритме', async () => {
      const response = await request(app)
        .post('/api/hash')
        .send({ str: 'test', algo: 'invalid' })
        .expect(400);

      expect(response.body.error).toBe('Неподдерживаемый алгоритм');
    });

    it('должен вернуть ошибку при сбое хеширования', async () => {
      hashWrap.mockImplementation(() => {
        throw new Error('Hash error');
      });

      const response = await request(app)
        .post('/api/hash')
        .send({ str: 'test', algo: 'md5' })
        .expect(500);

      expect(response.body.error).toBe('Ошибка хеширования');
      expect(AuditLog.create).toHaveBeenCalledWith({
        user_id: mockUser.id,
        email: mockUser.email,
        action: 'hash_error',
        details: 'Hash error',
        is_error: true
      });
    });

    it('должен включать предупреждение о лимите в ответ', async () => {
      const mockHash = '123abc';
      hashWrap.mockReturnValue(mockHash);
      
      const response = await request(app)
        .post('/api/hash')
        .set('X-RateLimit-Warning', 'Rate limit warning')
        .send({ str: 'test', algo: 'md5' })
        .expect(200);

      expect(response.body.warning).toBe('Rate limit warning');
    });
  });
}); 