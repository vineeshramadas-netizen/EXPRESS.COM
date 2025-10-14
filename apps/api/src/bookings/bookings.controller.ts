import { Body, Controller, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

class HoldDto {
  roomId!: string;
  startDate!: string;
  endDate!: string;
  guests!: number;
}

@ApiTags('bookings')
@Controller('api/bookings')
export class BookingsController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx', { apiVersion: '2024-06-20' as any });

  constructor(private readonly bookings: BookingsService, private readonly prisma: PrismaService) {}

  @Post('hold')
  async hold(@Body() body: HoldDto) {
    const { roomId, startDate, endDate, guests } = body;
    const res = await this.bookings.hold(roomId, new Date(startDate), new Date(endDate), guests);
    return res;
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  async confirm(@Req() req: any, @Body() body: { holdId: string }) {
    const userId = req.user.userId as string;
    return this.bookings.confirm(body.holdId, userId);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.bookings.cancel(id, req.user.userId, !!req.user.isAdmin);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  get(@Req() req: any, @Param('id') id: string) {
    return this.bookings.get(id, req.user.userId, !!req.user.isAdmin);
  }

  @Get('/users/:userId/bookings')
  @UseGuards(JwtAuthGuard)
  myBookings(@Req() req: any, @Param('userId') userId: string) {
    if (userId !== req.user.userId && !req.user.isAdmin) {
      return [];
    }
    return this.bookings.listForUser(userId);
  }
}

@ApiTags('webhooks')
@Controller('api/webhooks/stripe')
export class StripeWebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx', { apiVersion: '2024-06-20' as any });

  constructor(private readonly bookings: BookingsService) {}

  @Post()
  async handle(@Req() req: any, @Headers('stripe-signature') sig: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const event = this.stripe.webhooks.constructEvent(req.rawBody, sig, secret);
    await this.bookings.finalizeFromWebhook(event);
    return { received: true };
  }
}
