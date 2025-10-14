import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('admin')
@Controller('api/admin/rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new RolesGuard(true))
  create(@Body() body: any) {
    return this.rooms.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, new RolesGuard(true))
  update(@Param('id') id: string, @Body() body: any) {
    return this.rooms.update(id, body);
  }
}
