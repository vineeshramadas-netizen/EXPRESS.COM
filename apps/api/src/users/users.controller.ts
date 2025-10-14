import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':userId/bookings')
  @UseGuards(JwtAuthGuard)
  async bookings(@Req() req: any, @Param('userId') userId: string) {
    if (userId !== req.user.userId && !req.user.isAdmin) return [];
    return this.prisma.booking.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }
}
