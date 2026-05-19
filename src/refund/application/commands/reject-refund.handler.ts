import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RejectRefundCommand } from './reject-refund.command';
import type { IRefundRepository } from '../../domain/repositories/refund.repository';

@CommandHandler(RejectRefundCommand)
export class RejectRefundHandler implements ICommandHandler<RejectRefundCommand> {
  constructor(
    @Inject('IRefundRepository')
    private readonly refundRepository: IRefundRepository,
  ) {}

  async execute(command: RejectRefundCommand): Promise<void> {
    const { refundId, reason } = command;

    const refund = await this.refundRepository.findById(refundId);
    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    refund.reject(reason);

    await this.refundRepository.save(refund);
  }
}
