FROM node:20-alpine AS builder
WORKDIR /repo
COPY ../../package.json ../../package-lock.json ./
COPY ../../apps/api ./apps/api
COPY ../../apps/web ./apps/web
RUN npm ci
RUN npm -w @express-com/web run build

FROM node:20-alpine AS runner
WORKDIR /repo/apps/web
ENV NODE_ENV=production
COPY --from=builder /repo/apps/web/.next ./.next
COPY --from=builder /repo/apps/web/package.json ./
COPY --from=builder /repo/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
