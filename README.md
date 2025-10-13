## Express.com - Hotel Booking App

Monorepo with API (Express + TypeScript + Prisma + PostgreSQL) and Web (Next.js + TailwindCSS).

### Tech Stack
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- Frontend: Next.js (App Router), TypeScript, TailwindCSS
- Auth: JWT access + refresh tokens
- Payments: Stripe Checkout (test mode)
- Storage: Local uploads (S3-ready stub)
- Email: Placeholder (documented for SendGrid)
- Tests: Jest + supertest (API), Vitest + RTL (Web)
- CI: GitHub Actions
- Docker: docker-compose for API, Web, and Postgres

### Getting Started (Dev)
1. Copy envs
   - `cp .env.example .env` and also copy to `apps/api/.env` if you prefer per-app
2. Install deps
   - `npm install`
3. Start Postgres (optional if you have local):
   - `docker compose up -d db`
4. Generate Prisma client & run migrations
   - `npm -w @express-com/api run generate`
   - `npm -w @express-com/api run migrate`
5. Seed data
   - `npm -w @express-com/api run seed`
6. Run API
   - `npm -w @express-com/api run dev`
7. Run Web
   - `npm -w @express-com/web run dev`

### Run Tests
- API: `npm -w @express-com/api run test`
- Web: `npm -w @express-com/web run test`

### API Endpoints (examples)
- POST `/api/auth/register` { name, email, password }
- POST `/api/auth/login` { email, password }
- POST `/api/auth/refresh` { refreshToken }
- POST `/api/auth/forgot-password` { email }
- POST `/api/auth/reset-password` { token, password }
- GET `/api/hotels?city=Austin&minPrice=5000&maxPrice=15000&amenities=wifi,parking`
- GET `/api/hotels/:id`
- POST `/api/hotels` (admin)
- PUT `/api/hotels/:id` (admin)
- DELETE `/api/hotels/:id` (admin)
- GET `/api/rooms/:id`
- POST `/api/bookings` { roomId, checkIn, checkOut, quantity }
- GET `/api/bookings/:id`
- GET `/api/users/:id/bookings`
- POST `/api/payments/checkout` { bookingId } -> returns Stripe Checkout session URL
- POST `/api/webhooks/stripe` (Stripe webhook)
- POST `/api/uploads` (admin, multipart/form-data with `file` field)
- GET `/api/admin/stats`
- API docs at `/api/docs`

### Deployment
- Build images and run with compose
  - `docker compose up --build`
- Configure environment variables in your platform (DATABASE_URL, JWT_SECRET, STRIPE_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_API_BASE, etc.)

### Notes
- Web uses `NEXT_PUBLIC_API_BASE` to call API.
- Replace Stripe keys with your test/prod keys.
- To enable S3 storage, swap the local storage service with an S3 client (docs inline in code).
