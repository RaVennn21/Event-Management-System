import { TicketEntity } from '../entities/ticket.entity';

export interface ITicketRepository {
  findByCode(ticketCode: string): Promise<TicketEntity | null>;
  findByBookingId(bookingId: string): Promise<TicketEntity[]>;
  save(ticket: TicketEntity): Promise<void>;
}
