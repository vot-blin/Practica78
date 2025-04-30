FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Устанавливаем зависимости для всех сервисов
RUN npm install express express-graphql graphql cors ws

EXPOSE 3000 8080 8081

# Команда по умолчанию (можно переопределить в docker-compose.yml)
CMD ["node", "server.js"]