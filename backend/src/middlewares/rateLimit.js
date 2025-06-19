// Простая реализация rate limit: 30 запросов в минуту, предупреждение если слишком часто
const userRequests = new Map();

const RATE_LIMIT = 30;      // максимум запросов за минуту
const WINDOW_MS = 60 * 1000; // окно в миллисекундах (1 минута)
const MIN_INTERVAL = 2000;   // минимальный интервал между запросами (2 секунды)

function rateLimit(req, res, next) {
  const key = req.user ? req.user.email : req.ip;
  const now = Date.now();
  if (!userRequests.has(key)) {
    userRequests.set(key, []);
  }
  // Оставляем только свежие запросы за последнюю минуту
  const timestamps = userRequests.get(key).filter(ts => now - ts < WINDOW_MS);
  timestamps.push(now);
  userRequests.set(key, timestamps);

  if (timestamps.length > RATE_LIMIT) {
    return res.status(429).json({ error: 'Слишком много запросов. Лимит 30 в минуту.' });
  }
  // Если пользователь шлёт чаще 1 раза в 2 секунды — предупреждаем
  if (timestamps.length > 1 && now - timestamps[timestamps.length - 2] < MIN_INTERVAL) {
    res.set('X-RateLimit-Warning', 'Не чаще 1 раза в 2 секунды!');
  }
  next();
}

rateLimit.__getUserRequests = () => userRequests;

module.exports = rateLimit; 