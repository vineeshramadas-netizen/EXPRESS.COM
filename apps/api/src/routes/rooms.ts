import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth';

export const roomsRouter = Router();

const roomSchema = z.object({
  hotelId: z.string().cuid(),
  title: z.string().min(1),
  type: z.string().min(1),
  pricePerNight: z.number().int().nonnegative(),
  maxGuests: z.number().int().positive(),
  totalUnits: z.number().int().positive(),
  images: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
});

roomsRouter.get('/:id', async (req, res) => {
  const room = await prisma.room.findUnique({ where: { id: String(req.params.id) } });
  if (!room) return res.status(404).json({ success: false, error: 'not_found' });
  res.json({ success: true, data: room });
});

roomsRouter.post('/', requireAdmin, async (req, res) => {
  const parsed = roomSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  const { images, ...data } = parsed.data;
  const created = await prisma.room.create({ data: { ...data, images } });
  res.status(201).json({ success: true, data: created });
});

roomsRouter.put('/:id', requireAdmin, async (req, res) => {
  const parsed = roomSchema.partial().omit({ hotelId: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  const updated = await prisma.room.update({ where: { id: String(req.params.id) }, data: parsed.data });
  res.json({ success: true, data: updated });
});

roomsRouter.delete('/:id', requireAdmin, async (req, res) => {
  await prisma.room.delete({ where: { id: String(req.params.id) } });
  res.status(204).send();
});
