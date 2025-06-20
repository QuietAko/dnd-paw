FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# остальной код монтируется через volume, COPY . . не нужен
