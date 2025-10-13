import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth';

export const hotelsRouter = Router();

const hotelCreateSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  propertyType: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().min(1),
  images: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  policies: z.string().optional(),
});

hotelsRouter.get('/', async (req, res) => {
  const q = z
    .object({
      city: z.string().optional(),
      minPrice: z.coerce.number().optional(),
      maxPrice: z.coerce.number().optional(),
      rating: z.coerce.number().optional(),
      amenities: z.string().optional(),
      propertyType: z.string().optional(),
      page: z.coerce.number().default(1),
      pageSize: z.coerce.number().default(10),
    })
    .safeParse(req.query);
  if (!q.success) return res.status(400).json({ success: false, error: 'validation_error' });

  const { city, minPrice, maxPrice, rating, amenities, propertyType, page, pageSize } = q.data;
  const amenityList = amenities?.split(',').filter(Boolean) || [];

  const hotels = await prisma.hotel.findMany({
    where: {
      city: city || undefined,
      rating: rating ? { gte: rating } : undefined,
      propertyType: propertyType || undefined,
      rooms: minPrice || maxPrice ? { some: { pricePerNight: { gte: minPrice || 0, lte: maxPrice || 999999 } } } : undefined,
      amenities: amenityList.length ? { hasEvery: amenityList } : undefined,
    },
    include: { rooms: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { rating: 'desc' },
  });

  res.json({ success: true, data: hotels });
});

hotelsRouter.get('/:id', async (req, res) => {
  const hotel = await prisma.hotel.findUnique({ where: { id: String(req.params.id) }, include: { rooms: true, reviews: true } });
  if (!hotel) return res.status(404).json({ success: false, error: 'not_found' });
  res.json({ success: true, data: hotel });
});

hotelsRouter.post('/', requireAdmin, async (req, res) => {
  const parsed = hotelCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  const { images, ...data } = parsed.data;
  const created = await prisma.hotel.create({ data: { ...data, images } });
  res.status(201).json({ success: true, data: created });
});

hotelsRouter.put('/:id', requireAdmin, async (req, res) => {
  const { success, data } = hotelCreateSchema.partial().safeParse(req.body);
  if (!success) return res.status(400).json({ success: false, error: 'validation_error' });
  const updated = await prisma.hotel.update({ where: { id: String(req.params.id) }, data });
  res.json({ success: true, data: updated });
});

hotelsRouter.delete('/:id', requireAdmin, async (req, res) => {
  await prisma.hotel.delete({ where: { id: String(req.params.id) } });
  res.status(204).send();
});
