import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException } from '@nestjs/common';
import { RequestRefundCommand } from './request-refund.command';
import { RefundEntity } from '../../domain/entities/refund.entity';
import type { IRefundRepository } from '../../domain/repositories/refund.repository';
import type { IBookingValidationService } from '../services/booking-validation.service.interface';

@CommandHandler(RequestRefundCommand)
export class RequestRefundHandler implements ICommandHandler<RequestRefundCommand> {
  constructor(
    @Inject('IRefundRepository')
    private readonly refundRepository: IRefundRepository,
    @Inject('IBookingValidationService')
    private readonly bookingValidationService: IBookingValidationService,
  ) {}

  async execute(command: RequestRefundCommand): Promise<void> {
    const { bookingId } = command;

    const bookingDetails = await this.bookingValidationService.getBookingDetails(bookingId);
    if (!bookingDetails.isPaid) {
      throw new BadRequestException('Refund can only be requested for paid bookings');
    }

    const existingRefund = await this.refundRepository.findByBookingId(bookingId);
    if (existingRefund) {
      throw new BadRequestException('Refund has already been requested for this booking');
    }

    const refund = RefundEntity.request(
      bookingId,
      bookingDetails.isEventCancelled,
      bookingDetails.hasCheckedInTickets,
      bookingDetails.eventDate,
    );

    await this.refundRepository.save(refund);
  }
}
