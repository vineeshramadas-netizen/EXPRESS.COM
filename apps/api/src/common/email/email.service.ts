import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

type BookingEmail = {
  bookingId: string;
  hotelName: string;
  roomTitle: string;
  startDate: Date;
  endDate: Date;
  totalPrice: string;
};

@Injectable()
export class EmailService {
  constructor() {
    const key = process.env.SENDGRID_API_KEY;
    if (key) sgMail.setApiKey(key);
  }

  async sendBookingConfirmation(to: string, info: BookingEmail) {
    const from = process.env.SENDGRID_FROM_EMAIL || 'bookings@example.com';
    const text = `Your booking ${info.bookingId} is confirmed at ${info.hotelName} (${info.roomTitle}) from ${info.startDate.toDateString()} to ${info.endDate.toDateString()} for total ${info.totalPrice}.`;
    if (!process.env.SENDGRID_API_KEY) {
      console.log(`[EMAIL] To: ${to} | ${text}`);
      return;
    }
    await (sgMail as any).send({ to, from, subject: 'Booking confirmed', text });
  }
}
