import { prisma } from '../lib/prisma';
import { differenceInCalendarDays } from 'date-fns';

export type AvailabilityInput = {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  quantity: number;
};

export async function isRoomAvailable({ roomId, checkIn, checkOut, quantity }: AvailabilityInput) {
  const room = await prisma.room.findUniqueOrThrow({ where: { id: roomId } });
  const overlapping = await prisma.booking.aggregate({
    where: {
      roomId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      NOT: [{ checkOut: { lte: checkIn } }, { checkIn: { ge: checkOut } }],
    },
    _sum: { quantity: true },
  });
  const reserved = overlapping._sum.quantity || 0;
  return room.totalUnits - reserved >= quantity;
}

export function computePrice(nightlyCents: number, nights: number, quantity: number) {
  const subtotalCents = nightlyCents * nights * quantity;
  const taxesCents = Math.round(subtotalCents * 0.1);
  const feesCents = Math.round(199 * quantity);
  const totalCents = subtotalCents + taxesCents + feesCents;
  return { subtotalCents, taxesCents, feesCents, totalCents };
}

export async function createBookingDraft(userId: string, roomId: string, checkIn: Date, checkOut: Date, quantity: number) {
  const nights = Math.max(differenceInCalendarDays(checkOut, checkIn), 1);
  const room = await prisma.room.findUniqueOrThrow({ where: { id: roomId } });
  const available = await isRoomAvailable({ roomId, checkIn, checkOut, quantity });
  if (!available) throw new Error('unavailable');
  const pricing = computePrice(room.pricePerNight, nights, quantity);
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
      checkIn,
      checkOut,
      nights,
      quantity,
      ...pricing,
      status: 'PENDING',
    },
  });
  return { booking, room };
}
