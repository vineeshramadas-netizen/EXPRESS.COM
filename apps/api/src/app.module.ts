import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { EmailModule } from './common/email/email.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '30', 10),
      },
    ]),
    PrismaModule,
    EmailModule,
    AuthModule,
    HotelsModule,
    RoomsModule,
    BookingsModule,
    AdminModule,
    UsersModule,
    ...(process.env.NODE_ENV !== 'production' ? [TestModule] as any : []),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
