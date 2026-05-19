import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PayBookingCommand } from './pay-booking.command';
import { IBookingRepository, I_BOOKING_REPOSITORY } from '../interfaces/booking.repository.interface';
import { Money } from '../../../event/domain/value-objects/money.value-object';

@CommandHandler(PayBookingCommand)
export class PayBookingCommandHandler implements ICommandHandler<PayBookingCommand, void> {
  constructor(
    @Inject(I_BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(command: PayBookingCommand): Promise<void> {
    const booking = await this.bookingRepository.findById(command.bookingId);
    if (!booking) {
      throw new Error('Booking not found.');
    }

    const paymentAmount = Money.create(command.amount, command.currency);
    const currentTime = new Date();

    booking.pay(paymentAmount, currentTime);

    await this.bookingRepository.save(booking);
  }
}
