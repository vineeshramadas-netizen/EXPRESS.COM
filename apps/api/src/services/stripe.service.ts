import Stripe from 'stripe';
import { prisma } from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_KEY || 'sk_test_123', { apiVersion: '2024-06-20' });

export async function createCheckoutSession(bookingId: string) {
  const booking = await prisma.booking.findUniqueOrThrow({ where: { id: bookingId }, include: { room: { include: { hotel: true } } } });
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        quantity: booking.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: booking.totalCents / booking.quantity,
          product_data: {
            name: `${booking.room.hotel.name} – ${booking.room.title} (${booking.nights} nights)`,
          },
        },
      },
    ],
    success_url: `${process.env.WEB_BASE_URL || 'http://localhost:3000'}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.WEB_BASE_URL || 'http://localhost:3000'}/booking/cancel`,
    metadata: { bookingId },
  });

  await prisma.booking.update({ where: { id: bookingId }, data: { stripeSessionId: session.id } });
  return session;
}

export async function handleStripeWebhook(rawBody: string, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('missing_webhook_secret');
  const stripe = new Stripe(process.env.STRIPE_KEY || 'sk_test_123', { apiVersion: '2024-06-20' });
  const evt = stripe.webhooks.constructEvent(rawBody, signature, secret);

  switch (evt.type) {
    case 'checkout.session.completed': {
      const session = evt.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      if (bookingId) {
        await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } });
      }
      break;
    }
    case 'charge.refunded': {
      const charge = evt.data.object as Stripe.Charge;
      const bookingId = (charge.metadata as any)?.bookingId;
      if (bookingId) {
        await prisma.booking.update({ where: { id: bookingId }, data: { status: 'REFUNDED' } });
      }
      break;
    }
    default:
      break;
  }
}
