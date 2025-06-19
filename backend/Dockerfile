# Dockerfile backend (заполнить позже) 

# Базовый образ
FROM node:18-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только production-зависимости
RUN npm ci --only=production

# Копируем исходники приложения
COPY . .

# Открываем порт (по умолчанию 4000)
EXPOSE 4000

# Запуск приложения
CMD ["node", "src/index.js"] 