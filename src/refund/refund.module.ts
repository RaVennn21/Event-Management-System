import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';

import { RequestRefundHandler } from './application/commands/request-refund.handler';
import { ApproveRefundHandler } from './application/commands/approve-refund.handler';
import { RejectRefundHandler } from './application/commands/reject-refund.handler';
import { MarkRefundPaidOutHandler } from './application/commands/mark-refund-paid-out.handler';

const MockRefundRepositoryProvider = {
  provide: 'IRefundRepository',
  useValue: {
    save: jest.fn(),
    findById: jest.fn(),
    findByBookingId: jest.fn(),
  },
};

const MockBookingValidationServiceProvider = {
  provide: 'IBookingValidationService',
  useValue: {
    getBookingDetails: jest.fn().mockResolvedValue({
      bookingId: 'test-booking',
      isPaid: true,
      isEventCancelled: false,
      hasCheckedInTickets: false,
      eventDate: new Date('2030-01-01'),
    }),
  },
};

const MockRefundPaymentServiceProvider = {
  provide: 'IRefundPaymentService',
  useValue: {
    processPayout: jest.fn().mockResolvedValue('MOCK-PAYMENT-REF'),
  },
};

@Module({
  imports: [CqrsModule],
  providers: [
    RefundService,
    RequestRefundHandler,
    ApproveRefundHandler,
    RejectRefundHandler,
    MarkRefundPaidOutHandler,
    MockRefundRepositoryProvider,
    MockBookingValidationServiceProvider,
    MockRefundPaymentServiceProvider,
  ],
  controllers: [RefundController],
})
export class RefundModule {}
