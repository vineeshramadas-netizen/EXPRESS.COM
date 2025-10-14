import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../lib/prisma';

export const usersRouter = Router();

usersRouter.get('/:id/bookings', requireAuth, async (req, res) => {
  const { id } = req.params;
  if (id !== (req as any).userId && (req as any).role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'forbidden' });
  }
  const bookings = await prisma.booking.findMany({ where: { userId: id }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: bookings });
});
