import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { city?: string; priceMin?: number; priceMax?: number; page?: number; pageSize?: number }) {
    const { city, priceMin, priceMax, page = 1, pageSize = 20 } = params;
    const where: any = {};
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (priceMin || priceMax) {
      where.rooms = { some: { pricePerNight: {} } };
      if (priceMin) where.rooms.some.pricePerNight.gte = priceMin;
      if (priceMax) where.rooms.some.pricePerNight.lte = priceMax;
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.hotel.findMany({ where, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.hotel.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async byId(id: string) {
    return this.prisma.hotel.findUnique({ where: { id }, include: { rooms: true } });
  }

  async create(data: any) {
    return this.prisma.hotel.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.hotel.update({ where: { id }, data });
  }
}
