const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const User = require('../models/user');
const Session = require('../models/session');
const AuditLog = require('../models/auditLog');
const { getRole } = require('../middlewares/auth');

const YANDEX_CLIENT_ID = process.env.YANDEX_CLIENT_ID;
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET;
const YANDEX_REDIRECT_URI = process.env.YANDEX_REDIRECT_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Роут для старта авторизации через Яндекс (редиректит пользователя на Яндекс)
router.get('/login', (req, res) => {
  const url = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(YANDEX_REDIRECT_URI)}`;
  res.redirect(url);
});

// Яндекс присылает сюда пользователя после авторизации
router.get('/callback/yandex', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Нет кода авторизации');
  try {
    // Получаем access_token по коду
    const tokenRes = await axios.post('https://oauth.yandex.ru/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: YANDEX_CLIENT_ID,
        client_secret: YANDEX_CLIENT_SECRET,
      },
    });
    const access_token = tokenRes.data.access_token;
    // Получаем инфу о пользователе
    const userRes = await axios.get('https://login.yandex.ru/info', {
      headers: { Authorization: `OAuth ${access_token}` },
    });
    const { default_email: email, real_name: name } = userRes.data;
    let user = await User.findByEmail(email);
    if (!user) user = await User.create({ email, name });
    // Генерируем токен сессии и сохраняем в БД
    const session_token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 дней
    await Session.create({ user_id: user.id, session_token, expires_at });
    // Логируем вход
    await AuditLog.create({ user_id: user.id, email, action: 'login', details: 'Вход через Яндекс' });
    // Ставим cookie сессии
    res.cookie('session_token', session_token, {
      httpOnly: true,
      secure: false, // true для https
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.redirect('/');
  } catch (e) {
    await AuditLog.create({ user_id: null, email: null, action: 'login_error', details: e.message, is_error: true });
    res.status(500).send('Ошибка авторизации');
  }
});

// Выход пользователя: удаляем сессию из БД и чистим куку
router.post('/logout', async (req, res) => {
  const token = req.cookies?.session_token;
  if (token) {
    await Session.deleteByToken(token);
    res.clearCookie('session_token');
    if (req.user) {
      await AuditLog.create({ user_id: req.user.id, email: req.user.email, action: 'logout', details: 'Выход из системы' });
    }
  }
  res.json({ ok: true });
});

// Получить инфу о текущем пользователе
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Не авторизован' });
  res.json({
    email: req.user.email,
    name: req.user.name,
    role: getRole(req.user.email),
  });
});

module.exports = router; 