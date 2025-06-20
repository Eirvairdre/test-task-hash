// Загрузка переменных окружения
require('dotenv').config();
// Импорт основных зависимостей
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sessionMiddleware = require('./middlewares/session');
const authRoutes = require('./routes/auth');
const hashRoutes = require('./routes/hash');
const auditRoutes = require('./routes/audit');
// Swagger для API документации
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(__dirname + '/../swagger.yaml');
// Инициализация Express приложения
const app = express();

// Настройка CORS для поддержки авторизации через cookie между фронтом и бэком
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Явная обработка preflight-запросов OPTIONS для всех путей
app.options('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Подключаем базовые middleware
app.use(express.json());                // Парсинг JSON в запросах
app.use(cookieParser());                // Парсинг cookies
app.use(sessionMiddleware);             // Обработка сессий

// Основные роуты API
app.use('/api/auth', authRoutes);    // Авторизация, сессии, user info
app.use('/api/hash', hashRoutes);    // Хеширование строки
app.use('/api/audit', auditRoutes);  // Аудит-логи (только для админа)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Swagger UI документация

// Можно добавить другие роуты ниже

// Healthcheck эндпоинт для мониторинга работоспособности сервера
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app; 