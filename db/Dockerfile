# Обычно для MySQL достаточно стандартного образа из docker-compose.yml
# Этот Dockerfile можно использовать, если потребуется кастомизация (например, плагины, настройки)
# Пример:
# FROM mysql:8.0
# COPY my.cnf /etc/mysql/conf.d/

# Базовый образ MySQL
FROM mysql:8.0

# Копируем скрипт инициализации в стандартную папку MySQL
COPY init.sql /docker-entrypoint-initdb.d/

# Можно добавить свои конфиги, если нужно
# COPY my.cnf /etc/mysql/conf.d/

# Dockerfile db (заполнить позже) 