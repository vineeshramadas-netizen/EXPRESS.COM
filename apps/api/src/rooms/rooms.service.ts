import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.room.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.room.update({ where: { id }, data });
  }
}
