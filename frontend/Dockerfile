# Dockerfile frontend 

# Build stage
FROM node:18-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-bullseye AS runner
WORKDIR /app

ENV NODE_ENV production

# Копируем необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"] 