const app = require('./app');

const PORT = process.env.PORT || 4000;

// Запуск сервера на указанном порту
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 