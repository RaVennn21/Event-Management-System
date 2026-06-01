import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { BookingModule } from './booking/booking.module';
import { TicketModule } from './ticket/ticket.module';
import { RefundModule } from './refund/refund.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [EventModule, BookingModule, TicketModule, RefundModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
