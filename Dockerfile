FROM node:26.7.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM scratch AS export
COPY --from=builder /app/dist /