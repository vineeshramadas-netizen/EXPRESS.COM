import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../common/email/email.module';
import { BookingsService } from '../bookings/bookings.service';
import { TestController } from '../bookings/bookings.controller';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [TestController],
  providers: [BookingsService],
})
export class TestModule {}
