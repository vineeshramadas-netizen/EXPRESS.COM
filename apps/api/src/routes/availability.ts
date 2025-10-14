import { Router } from 'express';
import { z } from 'zod';
import { isRoomAvailable } from '../services/booking.service';

export const availabilityRouter = Router();

const schema = z.object({
  roomId: z.string().cuid(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  quantity: z.coerce.number().int().positive().default(1),
});

availabilityRouter.get('/', async (req, res) => {
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  const available = await isRoomAvailable(parsed.data);
  res.json({ success: true, data: { available } });
});
