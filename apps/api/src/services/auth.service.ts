import { prisma } from '../lib/prisma';
import { hashPassword, verifyPassword } from '../utils/password';
import { getRefreshExpiry, signAccessToken, signRefreshToken, verifyToken } from '../utils/jwt';
import crypto from 'crypto';

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('email_taken');
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('invalid_credentials');
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error('invalid_credentials');

  const access = signAccessToken({ sub: user.id, role: user.role });
  const refresh = signRefreshToken({ sub: user.id, role: user.role });
  const tokenHash = sha256(refresh);
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt: getRefreshExpiry() },
  });
  return { user, access, refresh };
}

export async function refreshTokens(refreshToken: string) {
  const payload = verifyToken<{ sub: string }>(refreshToken);
  const tokenHash = sha256(refreshToken);
  const token = await prisma.refreshToken.findFirst({
    where: { userId: payload.sub, tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
  });
  if (!token) throw new Error('invalid_refresh');

  const user = await prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
  const access = signAccessToken({ sub: user.id, role: user.role });
  const refresh = signRefreshToken({ sub: user.id, role: user.role });
  await prisma.refreshToken.update({ where: { id: token.id }, data: { revokedAt: new Date() } });
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: sha256(refresh), expiresAt: getRefreshExpiry() } });
  return { user, access, refresh };
}

export async function createPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return; // do not reveal existence
  const raw = crypto.randomBytes(32).toString('hex');
  const tokenHash = sha256(raw);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
  return { user, raw };
}

export async function resetPassword(rawToken: string, newPassword: string) {
  const tokenHash = sha256(rawToken);
  const token = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (!token) throw new Error('invalid_token');
  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: token.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
  ]);
}

function sha256(v: string) {
  return crypto.createHash('sha256').update(v).digest('hex');
}
