// Получаем список email-админов из переменных окружения
function getAdminEmails() {
  return process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
}

// Middleware: проверка, что пользователь авторизован
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Требуется аутентификация' });
  }
  next();
}

// Middleware: проверка, что пользователь — админ
function requireAdmin(req, res, next) {
  const adminEmails = getAdminEmails();
  if (!req.user || !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ error: 'Доступ только для администратора' });
  }
  next();
}

// Получить роль пользователя по email (admin или user)
function getRole(email) {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email) ? 'admin' : 'user';
}

module.exports = { requireAuth, requireAdmin, getRole }; 