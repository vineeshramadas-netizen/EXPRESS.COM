import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './env';
import { healthRouter } from './routes/health';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/health', healthRouter);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.port}`);
});
