import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ViewPurchasedTicketsQuery } from './view-purchased-tickets.query';
import { TicketResponseDto } from '../dtos/ticket-response.dto';
import { Inject } from '@nestjs/common';
import type { ITicketRepository } from '../../domain/repositories/ticket.repository.interface';

@QueryHandler(ViewPurchasedTicketsQuery)
export class ViewPurchasedTicketsHandler implements IQueryHandler<ViewPurchasedTicketsQuery> {
  constructor(
    @Inject('ITicketRepository')
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(query: ViewPurchasedTicketsQuery): Promise<TicketResponseDto[]> {
    const { bookingId } = query;

    const tickets = await this.ticketRepository.findByBookingId(bookingId);

    return tickets.map(ticket => ({
      ticketCode: ticket.ticketCode,
      eventId: ticket.eventId,
      bookingId: ticket.bookingId,
      status: ticket.status.value,
    }));
  }
}
