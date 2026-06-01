import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CheckInTicketCommand } from './check-in-ticket.command';
import type { ITicketRepository } from '../../domain/repositories/ticket.repository.interface';

@CommandHandler(CheckInTicketCommand)
export class CheckInTicketHandler implements ICommandHandler<CheckInTicketCommand> {
  constructor(
    @Inject('ITicketRepository')
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(command: CheckInTicketCommand): Promise<void> {
    const { ticketCode, eventId } = command;

    const ticket = await this.ticketRepository.findByCode(ticketCode);
    if (!ticket) {
      throw new NotFoundException(`Ticket with code ${ticketCode} not found`);
    }

    ticket.checkIn(eventId);

    await this.ticketRepository.save(ticket);
  }
}
