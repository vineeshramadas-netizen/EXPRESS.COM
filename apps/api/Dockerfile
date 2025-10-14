# Build stage
FROM node:20-alpine AS builder
WORKDIR /repo
COPY ../../package.json ../../package-lock.json ./
COPY ../../apps/api ./apps/api
COPY ../../apps/web ./apps/web
RUN npm ci
RUN npm -w @express-com/api run generate
RUN npm -w @express-com/api run build

# Runtime stage
FROM node:20-alpine
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=builder /repo .
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
