import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, error: 'unauthorized' });
  try {
    const payload = verifyToken<{ sub: string; role: 'USER' | 'ADMIN' }>(token);
    (req as any).userId = payload.sub;
    (req as any).role = payload.role;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'unauthorized' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if ((req as any).role !== 'ADMIN') return res.status(403).json({ success: false, error: 'forbidden' });
  next();
}
