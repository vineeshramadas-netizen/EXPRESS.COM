# Express.com – Full‑stack Hotel Booking

Monorepo with Next.js frontend and NestJS backend using PostgreSQL (Prisma), Stripe, and SendGrid.

## Apps
- `apps/web`: Next.js (App Router) frontend
- `apps/api`: NestJS REST API with Swagger
- `prisma`: Database schema and seed

## Quick Start (Local with Docker)

1. Copy envs:
   ```bash
   cp .env.example .env
   ```
2. Start stack:
   ```bash
   docker-compose up --build
   ```
3. Run DB migrations and seed (or use Makefile):
   ```bash
   npm run prisma:generate
   npm run migrate:dev
   npm run seed
   ```
   Or with Makefile shortcuts:
   ```bash
   make up
   make migrate
   make seed
   ```
4. Open:
   - API Swagger: http://localhost:4000/api/docs
   - Web: http://localhost:3000

## Development without Docker

- Install deps:
  ```bash
  npm install
  ```
- Start dev servers:
  ```bash
  npm run dev
  ```

## CI
GitHub Actions workflow runs lint, tests, and build on push.

## Environment Variables
See `.env.example` for required keys (no real secrets committed).

Seeded credentials:
- Admin: `admin@example.com` / `AdminPass123!`
- User: `user@example.com` / `UserPass123!`

## Stripe Webhooks (dev)
Use Stripe CLI to forward webhooks to the API and set `STRIPE_WEBHOOK_SECRET`.

```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

## End-to-end tests (Playwright)

1. Start stack:
   ```bash
   make up
   make migrate
   make seed
   ```
2. Install browsers:
   ```bash
   npx playwright install --with-deps
   ```
3. Run tests:
   ```bash
   npm run e2e
   ```

Notes: E2E uses test-only endpoints under `/api/test/*` which are disabled in production.

## Makefile commands
```
make up        # build and run stack
make logs      # tail logs
make migrate   # apply dev migrations
make seed      # seed DB
make down      # stop and remove containers/volumes
```

## Notes
- JWT access + refresh with httpOnly cookie
- Rate limiting for auth endpoints
- Prisma schema includes indices for performance
