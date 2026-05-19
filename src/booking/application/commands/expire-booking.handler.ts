import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ExpireBookingCommand } from './expire-booking.command';
import { I_BOOKING_REPOSITORY } from '../interfaces/booking.repository.interface';
import type { IBookingRepository } from '../interfaces/booking.repository.interface';

@CommandHandler(ExpireBookingCommand)
export class ExpireBookingCommandHandler implements ICommandHandler<ExpireBookingCommand, void> {
  constructor(
    @Inject(I_BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(command: ExpireBookingCommand): Promise<void> {
    const booking = await this.bookingRepository.findById(command.bookingId);
    if (!booking) {
      throw new Error('Booking not found.');
    }

    const currentTime = new Date();
    booking.expire(currentTime);

    await this.bookingRepository.save(booking);
  }
}
