import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';
import { prisma } from '../lib/prisma';

export const adminRouter = Router();

adminRouter.get('/stats', requireAdmin, async (_req, res) => {
  const [bookingCount, revenue, userCount] = await Promise.all([
    prisma.booking.count({ where: { status: { in: ['CONFIRMED', 'REFUNDED'] } } }),
    prisma.booking.aggregate({ _sum: { totalCents: true }, where: { status: { in: ['CONFIRMED'] } } }),
    prisma.user.count(),
  ]);
  res.json({ success: true, data: { bookings: bookingCount, revenueCents: revenue._sum.totalCents || 0, users: userCount } });
});
