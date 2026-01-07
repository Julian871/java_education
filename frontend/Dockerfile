# Этап 1: Сборка приложения
FROM node:20-slim AS builder

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# ПОЛНАЯ очистка (удаляем все lock файлы)
RUN rm -rf node_modules package-lock.json package-lock package-lock.json.lock && \
    npm cache clean --force --loglevel=error

# Устанавливаем зависимости С ПЕРЕОПРЕДЕЛЕНИЕМ esbuild
RUN npm install --legacy-peer-deps

# Копируем исходный код
COPY . .

# Создаем production сборку
RUN npm run build

# Проверяем, что сборка создалась
RUN ls -la /app/dist/

# Этап 2: Сервирование приложения
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]