import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('hotels')
@Controller('api/hotels')
export class HotelsController {
  constructor(private readonly hotels: HotelsService) {}

  @Get()
  async list(
    @Query('city') city?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
  ) {
    // Defensive parsing to avoid NaN/undefined unions breaking Prisma where
    const pMin = priceMin != null && priceMin !== '' ? Number(priceMin) : undefined;
    const pMax = priceMax != null && priceMax !== '' ? Number(priceMax) : undefined;
    const p = Number.isFinite(Number(page)) ? Number(page) : 1;
    const ps = Number.isFinite(Number(pageSize)) ? Number(pageSize) : 20;

    return this.hotels.list({
      city: city && city.trim() ? city.trim() : undefined,
      priceMin: typeof pMin === 'number' && Number.isFinite(pMin) ? pMin : undefined,
      priceMax: typeof pMax === 'number' && Number.isFinite(pMax) ? pMax : undefined,
      page: p,
      pageSize: ps,
    });
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.hotels.byId(id);
  }
}

@ApiTags('admin')
@Controller('api/admin/hotels')
export class AdminHotelsController {
  constructor(private readonly hotels: HotelsService, private readonly prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new RolesGuard(true))
  create(@Body() body: any) {
    return this.hotels.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, new RolesGuard(true))
  update(@Param('id') id: string, @Body() body: any) {
    return this.hotels.update(id, body);
  }

  @Post(':id/rooms')
  @UseGuards(JwtAuthGuard, new RolesGuard(true))
  async createRoomForHotel(@Param('id') hotelId: string, @Body() body: any) {
    return this.prisma.room.create({
      data: { hotelId, title: body.title, description: body.description, roomType: body.roomType, pricePerNight: body.pricePerNight, maxGuests: body.maxGuests, totalInventory: body.totalInventory, images: body.images || [] },
    });
  }
}
