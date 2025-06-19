// Импорт моделей для работы с сессиями и пользователями
const Session = require('../models/session');
const User = require('../models/user');

// Middleware для аутентификации пользователя по сессионному токену
module.exports = async function sessionMiddleware(req, res, next) {
  // Получаем токен сессии из cookies
  const token = req.cookies?.session_token;
  if (!token) {
    req.user = null; // Нет токена — пользователь не авторизован
    return next();
  }
  // Ищем активную сессию по токену
  const session = await Session.findByToken(token);
  // Проверяем валидность сессии и срок её действия
  if (!session || new Date(session.expires_at) < new Date()) {
    req.user = null;
    return next();
  }
  // Загружаем данные пользователя
  const user = await User.findById(session.user_id);
  req.user = user;    // Сохраняем пользователя в request
  req.session = session; // Сохраняем сессию в request
  next();
}; 