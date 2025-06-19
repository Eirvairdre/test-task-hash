require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./middlewares/session');
const authRoutes = require('./routes/auth');
const hashRoutes = require('./routes/hash');
const auditRoutes = require('./routes/audit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(__dirname + '/../swagger.yaml');
const app = express();

// JSON body, cookies, сессии
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

// Основные роуты API
app.use('/api/auth', authRoutes);    // авторизация, сессии, user info
app.use('/api/hash', hashRoutes);    // хеширование строки
app.use('/api/audit', auditRoutes);  // аудит-логи (только для админа)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Swagger UI

// Healthcheck для проверки, что сервер жив
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app; 