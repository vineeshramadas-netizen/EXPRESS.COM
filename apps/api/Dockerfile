# Build stage
FROM node:18-bullseye AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* .npmrc* ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY prisma prisma
RUN npm install
COPY . .
RUN npm run prisma:generate && npm run build -w @express-com/api

# Runtime stage
FROM node:18-bullseye AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=builder /usr/src/app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /usr/src/app/prisma ./prisma
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
