FROM node:26.7.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Estágio final mantém o dist em /app/dist para facilitar docker cp
FROM node:26.7.0-alpine AS export
WORKDIR /app
COPY --from=builder /app/dist ./dist