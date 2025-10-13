# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ../../package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["node", "dist/index.js"]
