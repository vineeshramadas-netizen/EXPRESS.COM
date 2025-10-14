import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addDays, differenceInCalendarDays, isBefore } from 'date-fns';
import Stripe from 'stripe';
import { EmailService } from '../common/email/email.service';

@Injectable()
export class BookingsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx', { apiVersion: '2024-06-20' as any });
  private holdMinutes = 15;

  constructor(private readonly prisma: PrismaService, private readonly email: EmailService) {}

  async isAvailable(roomId: string, startDate: Date, endDate: Date) {
    if (!isBefore(startDate, endDate)) throw new BadRequestException('Invalid date range');
    const overlappingBookings = await this.prisma.booking.count({
      where: {
        roomId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        NOT: [{ endDate: { lte: startDate } }, { startDate: { gte: endDate } }],
      },
    });
    const now = new Date();
    const overlappingHolds = await this.prisma.bookingHold.count({
      where: {
        roomId,
        expiresAt: { gt: now },
        NOT: [{ endDate: { lte: startDate } }, { startDate: { gte: endDate } }],
      },
    });
    return overlappingBookings === 0 && overlappingHolds === 0;
  }

  async hold(roomId: string, startDate: Date, endDate: Date, guests: number) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    if (guests > room.maxGuests) throw new BadRequestException('Too many guests');

    const available = await this.isAvailable(roomId, startDate, endDate);
    if (!available) throw new BadRequestException('Room not available');

    const expiresAt = addDays(new Date(), 0);
    expiresAt.setMinutes(expiresAt.getMinutes() + this.holdMinutes);

    const hold = await this.prisma.bookingHold.create({ data: { roomId, startDate, endDate, expiresAt, guests } as any });
    return { holdId: hold.id, expiresAt };
  }

  async confirm(holdId: string, userId: string) {
    const hold = await this.prisma.bookingHold.findUnique({ where: { id: holdId } });
    if (!hold || hold.expiresAt < new Date()) throw new BadRequestException('Hold expired');

    const room = await this.prisma.room.findUnique({ where: { id: hold.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const nights = differenceInCalendarDays(hold.endDate, hold.startDate);
    const totalPrice = room.pricePerNight.mul(nights);

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        hotelId: room.hotelId,
        roomId: room.id,
        startDate: hold.startDate,
        endDate: hold.endDate,
        nights,
        guests: (hold as any).guests ?? 1,
        totalPrice,
        status: 'PENDING',
      },
    });

    const pi = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(totalPrice) * 100),
      currency: 'usd',
      metadata: { bookingId: booking.id, holdId },
      automatic_payment_methods: { enabled: true },
    });

    await this.prisma.booking.update({ where: { id: booking.id }, data: { stripePaymentId: pi.id } });

    return { clientSecret: pi.client_secret };
  }

  async finalizeFromWebhook(event: Stripe.Event) {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const bookingId = (pi.metadata as any)?.bookingId;
      if (bookingId) {
        const updated = await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } });
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId }, include: { user: true, room: true, hotel: true } });
        if (booking) {
          this.email
            .sendBookingConfirmation(booking.user.email, {
              bookingId: booking.id,
              hotelName: booking.hotel.name,
              roomTitle: booking.room.title,
              startDate: booking.startDate,
              endDate: booking.endDate,
              totalPrice: booking.totalPrice.toString(),
            })
            .catch(() => undefined);
        }
      }
    }
    if (event.type === 'payment_intent.canceled') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const bookingId = (pi.metadata as any)?.bookingId;
      if (bookingId) await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELLED' } });
    }
  }

  async get(bookingId: string, requesterId: string, isAdmin: boolean) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (!isAdmin && booking.userId !== requesterId) throw new UnauthorizedException();
    return booking;
  }

  async listForUser(userId: string) {
    return this.prisma.booking.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async cancel(bookingId: string, requesterId: string, isAdmin: boolean) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (!isAdmin && booking.userId !== requesterId) throw new UnauthorizedException();

    await this.prisma.booking.update({ where: { id: bookingId }, data: { status: 'REFUNDED' } });
    // In test env we simulate refund; in prod use stripe.refunds.create
    return { success: true };
  }
}
