import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { CheckInTicketHandler } from './application/commands/check-in-ticket.handler';
import { ViewPurchasedTicketsHandler } from './application/queries/view-purchased-tickets.handler';

// Provide a mock implementation of the repository for now
const MockTicketRepositoryProvider = {
  provide: 'ITicketRepository',
  useValue: {
    findByCode: jest.fn(),
    findByBookingId: jest.fn(),
    save: jest.fn(),
  },
};

@Module({
  imports: [CqrsModule],
  controllers: [TicketController],
  providers: [
    TicketService,
    CheckInTicketHandler,
    ViewPurchasedTicketsHandler,
    MockTicketRepositoryProvider,
  ],
})
export class TicketModule {}
