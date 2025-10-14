import { PrismaClient, RoomType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.bookingHold.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('AdminPass123!', 12);
  const userPassword = await bcrypt.hash('UserPass123!', 12);

  await prisma.user.createMany({
    data: [
      { name: 'Admin', email: 'admin@example.com', passwordHash: adminPassword, isAdmin: true },
      { name: 'User', email: 'user@example.com', passwordHash: userPassword, isAdmin: false },
    ],
  });

  const cities = ['New York', 'San Francisco', 'Chicago'];
  for (const city of cities) {
    for (let i = 1; i <= 5; i++) {
      const hotel = await prisma.hotel.create({
        data: {
          name: `${city} Hotel ${i}`,
          description: 'A lovely place to stay',
          address: `${i} Main St`,
          city,
          country: 'USA',
          images: [],
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        },
      });

      await prisma.room.createMany({
        data: [
          {
            hotelId: hotel.id,
            title: 'Standard Single',
            description: 'Cozy single room',
            roomType: RoomType.SINGLE,
            pricePerNight: 89.99,
            maxGuests: 1,
            totalInventory: 10,
            images: [],
          },
          {
            hotelId: hotel.id,
            title: 'Deluxe Double',
            description: 'Spacious double room',
            roomType: RoomType.DOUBLE,
            pricePerNight: 129.99,
            maxGuests: 2,
            totalInventory: 10,
            images: [],
          },
          {
            hotelId: hotel.id,
            title: 'Suite',
            description: 'Luxurious suite',
            roomType: RoomType.SUITE,
            pricePerNight: 199.99,
            maxGuests: 4,
            totalInventory: 5,
            images: [],
          },
        ],
      });
    }
  }

  console.log('Seed complete');
}

main().finally(() => prisma.$disconnect());
