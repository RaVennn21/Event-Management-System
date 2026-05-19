import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateBookingCommand } from './create-booking.command';
import { Booking } from '../../domain/entities/booking.aggregate-root';
import { IBookingRepository, I_BOOKING_REPOSITORY } from '../interfaces/booking.repository.interface';
import { IEventRepository, I_EVENT_REPOSITORY } from '../../../event/domain/repositories/event.repository.interface';
import { EventStatusEnum } from '../../../event/domain/value-objects/event-status.value-object';

@CommandHandler(CreateBookingCommand)
export class CreateBookingCommandHandler implements ICommandHandler<CreateBookingCommand, string> {
  constructor(
    @Inject(I_BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
    @Inject(I_EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(command: CreateBookingCommand): Promise<string> {
    if (command.quantity <= 0) {
      throw new Error('The ticket quantity must be greater than zero.');
    }

    const event = await this.eventRepository.findById(command.eventId);
    if (!event) {
      throw new Error('Event not found.');
    }

    if (event.status.value !== EventStatusEnum.PUBLISHED) {
      throw new Error('A booking can only be created for an event with the status Published.');
    }

    const category = event.ticketCategories.find(tc => tc.id === command.ticketCategoryId);
    if (!category) {
      throw new Error('Ticket category not found.');
    }

    if (!category.isActive) {
      throw new Error('A booking can only be created for an active ticket category.');
    }

    const now = new Date();
    if (now < category.salesStartDate || now > category.salesEndDate) {
      throw new Error('A booking can only be created within the ticket sales period.');
    }

    if (command.quantity > category.quota) {
      throw new Error('The ticket quantity must not exceed the remaining ticket quota.');
    }

    const existingBooking = await this.bookingRepository.findActiveBookingByCustomerAndEvent(
      command.customerId,
      command.eventId
    );
    if (existingBooking) {
      throw new Error('A customer cannot have more than one active booking for the same event.');
    }

    const paymentDeadline = new Date(now.getTime() + 15 * 60000); // 15 minutes from now

    const booking = Booking.create(
      command.eventId,
      command.ticketCategoryId,
      command.customerId,
      command.quantity,
      paymentDeadline,
      category.price
    );

    await this.bookingRepository.save(booking);

    return booking.id;
  }
}
