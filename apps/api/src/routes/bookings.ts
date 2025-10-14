import { Router } from 'express';
import { z } from 'zod';
import { createBookingDraft } from '../services/booking.service';
import { prisma } from '../lib/prisma';
import { generateBookingPDF } from '../services/pdf.service';
import { sendEmail } from '../services/email.service';
import { requireAuth } from '../middleware/auth';

export const bookingsRouter = Router();

const createSchema = z.object({
  roomId: z.string().cuid(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  quantity: z.coerce.number().int().positive().default(1),
});

bookingsRouter.post('/', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: 'validation_error' });
  try {
    const { booking } = await createBookingDraft((req as any).userId, parsed.data.roomId, parsed.data.checkIn, parsed.data.checkOut, parsed.data.quantity);
    const user = await prisma.user.findUnique({ where: { id: (req as any).userId } });
    if (user) await sendEmail(user.email, 'Booking created', `Your booking ${booking.id} is pending payment.`);
    res.status(201).json({ success: true, data: { booking, payment: { provider: 'stripe', mode: 'test' } } });
  } catch (e: any) {
    const code = e?.message === 'unavailable' ? 409 : 500;
    res.status(code).json({ success: false, error: e?.message || 'unknown_error' });
  }
});

bookingsRouter.get('/:id', requireAuth, async (req, res) => {
  // will secure by user in a later step
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const id = String(req.params.id);
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ success: false, error: 'not_found' });
  res.json({ success: true, data: booking });
});

bookingsRouter.get('/user/:userId', requireAuth, async (req, res) => {
  const userId = String(req.params.userId);
  if (userId !== (req as any).userId) return res.status(403).json({ success: false, error: 'forbidden' });
  const bookings = await prisma.booking.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: bookings });
});

bookingsRouter.post('/:id/cancel', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ success: false, error: 'not_found' });
  if (booking.userId !== (req as any).userId) return res.status(403).json({ success: false, error: 'forbidden' });
  if (booking.status !== 'CONFIRMED' && booking.status !== 'PENDING') return res.status(400).json({ success: false, error: 'cannot_cancel' });
  const updated = await prisma.booking.update({ where: { id }, data: { status: 'CANCELED' } });
  const user = await prisma.user.findUnique({ where: { id: updated.userId } });
  if (user) await sendEmail(user.email, 'Booking canceled', `Your booking ${updated.id} has been canceled.`);
  res.json({ success: true, data: updated });
});

bookingsRouter.get('/:id/confirmation.pdf', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return res.status(404).json({ success: false, error: 'not_found' });
  if (booking.userId !== (req as any).userId && (req as any).role !== 'ADMIN') return res.status(403).json({ success: false, error: 'forbidden' });
  const pdf = await generateBookingPDF(booking);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdf);
});
