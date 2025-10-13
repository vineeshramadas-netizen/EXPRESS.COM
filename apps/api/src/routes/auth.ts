import { Router } from 'express';
import { z } from 'zod';
import { createPasswordReset, loginUser, refreshTokens, registerUser, resetPassword } from '../services/auth.service';

export const authRouter = Router();

const registerSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error', details: parsed.error.flatten() });
  try {
    const user = await registerUser(parsed.data.name, parsed.data.email, parsed.data.password);
    res.status(201).json({ success: true, data: { id: user.id, email: user.email, name: user.name } });
  } catch (e: any) {
    const code = e?.message === 'email_taken' ? 409 : 500;
    res.status(code).json({ success: false, error: e?.message || 'unknown_error' });
  }
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error', details: parsed.error.flatten() });
  try {
    const { user, access, refresh } = await loginUser(parsed.data.email, parsed.data.password);
    res.json({ success: true, data: { accessToken: access, refreshToken: refresh, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
  } catch (e: any) {
    const code = e?.message === 'invalid_credentials' ? 401 : 500;
    res.status(code).json({ success: false, error: e?.message || 'unknown_error' });
  }
});

authRouter.post('/refresh', async (req, res) => {
  const token = (req.body?.refreshToken as string) || '';
  if (!token) return res.status(400).json({ success: false, error: 'missing_refresh' });
  try {
    const { access, refresh, user } = await refreshTokens(token);
    res.json({ success: true, data: { accessToken: access, refreshToken: refresh, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
  } catch (e: any) {
    res.status(401).json({ success: false, error: e?.message || 'invalid_refresh' });
  }
});

const forgotSchema = z.object({ email: z.string().email() });

authRouter.post('/forgot-password', async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  const result = await createPasswordReset(parsed.data.email);
  // In real life, send email with reset link containing token `result?.raw`
  res.json({ success: true, data: { sent: true } });
});

const resetSchema = z.object({ token: z.string().min(1), password: z.string().min(8) });

authRouter.post('/reset-password', async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  try {
    await resetPassword(parsed.data.token, parsed.data.password);
    res.json({ success: true, data: { reset: true } });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || 'invalid_token' });
  }
});
