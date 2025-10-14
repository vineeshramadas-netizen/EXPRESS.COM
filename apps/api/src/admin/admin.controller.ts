import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('bookings')
  @UseGuards(JwtAuthGuard, new RolesGuard(true))
  listBookings() {
    return this.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post('refunds')
  @UseGuards(JwtAuthGuard, new RolesGuard(true))
  async refund(@Body() body: { bookingId: string }) {
    // Stub for demo: mark refunded
    await this.prisma.booking.update({ where: { id: body.bookingId }, data: { status: 'REFUNDED' } });
    return { success: true };
  }
}
