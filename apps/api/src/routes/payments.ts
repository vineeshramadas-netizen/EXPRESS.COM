import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { createCheckoutSession } from '../services/stripe.service';

export const paymentsRouter = Router();

const createSchema = z.object({ bookingId: z.string().cuid() });

paymentsRouter.post('/checkout', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  try {
    const session = await createCheckoutSession(parsed.data.bookingId);
    res.json({ success: true, data: { id: session.id, url: session.url } });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || 'stripe_error' });
  }
});
