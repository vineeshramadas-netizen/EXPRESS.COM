import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  // Users
  const adminPass = await hashPassword('admin1234');
  const userPass = await hashPassword('user1234');
  const admin = await prisma.user.upsert({ where: { email: 'admin@express.com' }, update: {}, create: { email: 'admin@express.com', name: 'Admin', passwordHash: adminPass, role: 'ADMIN' } });
  const user = await prisma.user.upsert({ where: { email: 'user@express.com' }, update: {}, create: { email: 'user@express.com', name: 'Test User', passwordHash: userPass } });

  const cities = ['San Francisco', 'New York', 'Austin'];
  const hotels = [] as any[];
  for (let i = 0; i < 10; i++) {
    const city = cities[i % cities.length];
    const h = await prisma.hotel.create({
      data: {
        name: `Express Hotel ${i + 1}`,
        address: `${100 + i} Market St`,
        city,
        propertyType: i % 2 === 0 ? 'Hotel' : 'Apartment',
        latitude: 37.77 + i * 0.001,
        longitude: -122.41 - i * 0.001,
        description: 'A cozy place to stay.',
        images: [],
        amenities: ['wifi', 'parking']
      },
    });
    hotels.push(h);
  }

  for (const h of hotels) {
    const roomCount = 2 + (Math.floor(Math.random() * 3));
    for (let j = 0; j < roomCount; j++) {
      await prisma.room.create({
        data: {
          hotelId: h.id,
          title: ['Standard', 'Deluxe', 'Suite'][j % 3],
          type: ['standard', 'deluxe', 'suite'][j % 3],
          pricePerNight: 8000 + j * 3000,
          maxGuests: 2 + j,
          totalUnits: 5,
          images: [],
          amenities: ['wifi']
        },
      });
    }
  }

  console.log({ admin: admin.email, user: user.email });
}

main().finally(() => prisma.$disconnect());
