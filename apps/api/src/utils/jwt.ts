import jwt from 'jsonwebtoken';
import { add } from 'date-fns';

const ACCESS_DEFAULT_MIN = 15;
const REFRESH_DEFAULT_DAYS = 7;

export type JwtPayload = { sub: string; role: 'USER' | 'ADMIN' };

export function signAccessToken(payload: JwtPayload) {
  const ttl = process.env.ACCESS_TOKEN_TTL || `${ACCESS_DEFAULT_MIN}m`;
  return jwt.sign(payload, getSecret(), { expiresIn: ttl });
}

export function signRefreshToken(payload: JwtPayload) {
  const ttl = process.env.REFRESH_TOKEN_TTL || `${REFRESH_DEFAULT_DAYS}d`;
  return jwt.sign(payload, getSecret(), { expiresIn: ttl });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, getSecret()) as T;
}

export function getRefreshExpiry(): Date {
  const days = parseInt((process.env.REFRESH_TOKEN_TTL || `${REFRESH_DEFAULT_DAYS}d`).replace('d','')) || REFRESH_DEFAULT_DAYS;
  return add(new Date(), { days });
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}
