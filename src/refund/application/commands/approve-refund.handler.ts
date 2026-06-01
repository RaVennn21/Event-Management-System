import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ApproveRefundCommand } from './approve-refund.command';
import type { IRefundRepository } from '../../domain/repositories/refund.repository';

@CommandHandler(ApproveRefundCommand)
export class ApproveRefundHandler implements ICommandHandler<ApproveRefundCommand> {
  constructor(
    @Inject('IRefundRepository')
    private readonly refundRepository: IRefundRepository,
  ) {}

  async execute(command: ApproveRefundCommand): Promise<void> {
    const { refundId } = command;

    const refund = await this.refundRepository.findById(refundId);
    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    refund.approve();

    await this.refundRepository.save(refund);
  }
}
