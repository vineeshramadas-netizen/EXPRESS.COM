import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './env';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { hotelsRouter } from './routes/hotels';
import { roomsRouter } from './routes/rooms';
import { bookingsRouter } from './routes/bookings';
import { paymentsRouter } from './routes/payments';
import { webhooksRouter } from './routes/webhooks';
import { uploadsRouter } from './routes/uploads';
import { usersRouter } from './routes/users';
import { adminRouter } from './routes/admin';
import { reviewsRouter } from './routes/reviews';
import swaggerUi from 'swagger-ui-express';
import openapi from './openapi.json' assert { type: 'json' };
import { availabilityRouter } from './routes/availability';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
// Stripe webhook needs raw body for signature validation; mount before json
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api/availability', availabilityRouter);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.port}`);
});
