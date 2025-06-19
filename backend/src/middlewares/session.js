const Session = require('../models/session');
const User = require('../models/user');

// Middleware для авторизации по сессии
// Если есть session_token в cookie — ищу сессию и пользователя, иначе req.user = null
module.exports = async function sessionMiddleware(req, res, next) {
  const token = req.cookies?.session_token;
  if (!token) {
    req.user = null; // Нет токена — пользователь не авторизован
    return next();
  }
  const session = await Session.findByToken(token);
  if (!session || new Date(session.expires_at) < new Date()) {
    req.user = null; // Нет сессии или истекла
    return next();
  }
  const user = await User.findById(session.user_id);
  req.user = user; // Авторизую пользователя
  req.session = session;
  next();
}; 