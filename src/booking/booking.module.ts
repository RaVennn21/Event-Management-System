import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBookingCommandHandler } from './application/commands/create-booking.handler';
import { PayBookingCommandHandler } from './application/commands/pay-booking.handler';
import { ExpireBookingCommandHandler } from './application/commands/expire-booking.handler';
import { I_BOOKING_REPOSITORY } from './application/interfaces/booking.repository.interface';
import { PrismaBookingRepository } from './infrastructure/repositories/prisma-booking.repository';

const CommandHandlers = [
  CreateBookingCommandHandler,
  PayBookingCommandHandler,
  ExpireBookingCommandHandler,
];

@Module({
  imports: [CqrsModule],
  providers: [
    ...CommandHandlers,
    {
      provide: I_BOOKING_REPOSITORY,
      useClass: PrismaBookingRepository,
    },
  ],
})
export class BookingModule {}
