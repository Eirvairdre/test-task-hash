const app = require('./app');

const PORT = process.env.PORT || 4000;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 