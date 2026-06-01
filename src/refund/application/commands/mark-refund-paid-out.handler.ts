import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { MarkRefundPaidOutCommand } from './mark-refund-paid-out.command';
import type { IRefundRepository } from '../../domain/repositories/refund.repository';
import type { IRefundPaymentService } from '../services/refund-payment.service.interface';

@CommandHandler(MarkRefundPaidOutCommand)
export class MarkRefundPaidOutHandler implements ICommandHandler<MarkRefundPaidOutCommand> {
  constructor(
    @Inject('IRefundRepository')
    private readonly refundRepository: IRefundRepository,
    @Inject('IRefundPaymentService')
    private readonly refundPaymentService: IRefundPaymentService,
  ) {}

  async execute(command: MarkRefundPaidOutCommand): Promise<void> {
    const { refundId, paymentReference } = command;

    const refund = await this.refundRepository.findById(refundId);
    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    await this.refundPaymentService.processPayout(refundId, 0, { reference: paymentReference });

    refund.markAsPaidOut(paymentReference);

    await this.refundRepository.save(refund);
  }
}
