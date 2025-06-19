// Импорт библиотеки для работы с MySQL
const mysql = require('mysql2/promise');

// Создаём пул соединений с MySQL на основе переменных окружения
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,      // Ожидать соединения, если все заняты
  connectionLimit: 10,           // Максимум одновременных соединений
  queueLimit: 0,                 // Неограниченная очередь
});

module.exports = pool; 