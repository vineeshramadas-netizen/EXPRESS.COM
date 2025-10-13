import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

export const reviewsRouter = Router();

const schema = z.object({ hotelId: z.string().cuid(), rating: z.number().int().min(1).max(5), comment: z.string().optional() });

reviewsRouter.post('/', requireAuth, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  const review = await prisma.review.create({ data: { ...parsed.data, userId: (req as any).userId } });
  res.status(201).json({ success: true, data: review });
});
