import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('hotels')
@Controller('api/hotels')
export class HotelsController {
  constructor(private readonly hotels: HotelsService) {}

  @Get()
  async list(
    @Query('city') city?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.hotels.list({
      city,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
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
  constructor(private readonly hotels: HotelsService) {}

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
}
