import { RefundEntity } from './domain/entities/refund.entity';
import { RefundStatus } from './domain/value-objects/refund-status.value-object';
import { RefundRequested } from './domain/events/refund-requested.event';
import { RefundApproved } from './domain/events/refund-approved.event';
import { RefundRejected } from './domain/events/refund-rejected.event';
import { RefundPaidOut } from './domain/events/refund-paid-out.event';

describe('RefundEntity', () => {
    const futureDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const pastDeadline = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const bookingId = 'BKG-001';

    describe('User Story 15: Request Refund', () => {
        it('should create a refund with status Requested and raise RefundRequested event', () => {
            const refund = RefundEntity.request(
                bookingId,
                false,
                false,
                futureDeadline,
            );

            expect(refund.bookingId).toBe(bookingId);
            expect(refund.status.equals(RefundStatus.REQUESTED)).toBe(true);
            expect(refund.id).toBeDefined();
            expect(refund.domainEvents).toHaveLength(1);
            expect(refund.domainEvents[0]).toBeInstanceOf(RefundRequested);
            expect(refund.domainEvents[0].bookingId).toBe(bookingId);
        });

        it('Refund cannot be requested if ticket has already been checked in', () => {
            expect(() =>
                RefundEntity.request(
                    bookingId,
                    false,
                    true,
                    futureDeadline,
                ),
            ).toThrow('Refund cannot be requested if ticket has already been checked in');
        });

        it('should not allow refund request after the deadline has passed', () => {
            expect(() =>
                RefundEntity.request(
                    bookingId,
                    false,
                    false,
                    pastDeadline,
                ),
            ).toThrow('Refund cannot be requested after the refund deadline');
        });

        it('should auto-allow refund if event is cancelled (bypass deadline)', () => {
            const refund = RefundEntity.request(
                bookingId,
                true,
                false,
                pastDeadline,
            );

            expect(refund.status.equals(RefundStatus.REQUESTED)).toBe(true);
            expect(refund.domainEvents[0]).toBeInstanceOf(RefundRequested);
        });

        it('should still reject refund request with checked-in tickets even if event is cancelled', () => {
            expect(() =>
                RefundEntity.request(
                    bookingId,
                    true,
                    true,
                    futureDeadline,
                ),
            ).toThrow('Refund cannot be requested if ticket has already been checked in');
        });
    });

    describe('User Story 16: Approve Refund', () => {
        it('should approve a refund that is in Requested status', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.clearDomainEvents();

            refund.approve();

            expect(refund.status.equals(RefundStatus.APPROVED)).toBe(true);
            expect(refund.domainEvents).toHaveLength(1);
            expect(refund.domainEvents[0]).toBeInstanceOf(RefundApproved);
        });

        it('Refund cannot be approved if it is not in Requested status', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.approve();

            expect(() => refund.approve()).toThrow(
                'Refund can only be approved if its status is Requested',
            );
        });

        it('should not allow approval of a rejected refund', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.reject('Policy violation');

            expect(() => refund.approve()).toThrow(
                'Refund can only be approved if its status is Requested',
            );
        });

        it('should not allow approval of a paid-out refund', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.approve();
            refund.markAsPaidOut('PAY-REF-001');

            expect(() => refund.approve()).toThrow(
                'Refund can only be approved if its status is Requested',
            );
        });
    });

    describe('User Story 17: Reject Refund', () => {
        it('should reject a refund that is in Requested status with a reason', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.clearDomainEvents();

            const reason = 'Request does not comply with refund policy';
            refund.reject(reason);

            expect(refund.status.equals(RefundStatus.REJECTED)).toBe(true);
            expect(refund.rejectionReason).toBe(reason);
            expect(refund.domainEvents).toHaveLength(1);
            expect(refund.domainEvents[0]).toBeInstanceOf(RefundRejected);
            expect(refund.domainEvents[0].reason).toBe(reason);
        });

        it('Rejected refund must have a rejection reason', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);

            expect(() => refund.reject('')).toThrow(
                'Rejected refund must have a rejection reason',
            );
        });

        it('should not allow rejection with whitespace-only reason', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);

            expect(() => refund.reject('   ')).toThrow(
                'Rejected refund must have a rejection reason',
            );
        });

        it('should not allow rejection if status is not Requested', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.approve();

            expect(() => refund.reject('Too late')).toThrow(
                'Refund can only be rejected if its status is Requested',
            );
        });
    });

    describe('User Story 18: Mark Refund as Paid Out', () => {
        it('should mark an approved refund as paid out with a payment reference', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.approve();
            refund.clearDomainEvents();

            const paymentRef = 'PAY-REF-001';
            refund.markAsPaidOut(paymentRef);

            expect(refund.status.equals(RefundStatus.PAID_OUT)).toBe(true);
            expect(refund.paymentReference).toBe(paymentRef);
            expect(refund.domainEvents).toHaveLength(1);
            expect(refund.domainEvents[0]).toBeInstanceOf(RefundPaidOut);
            expect(refund.domainEvents[0].paymentReference).toBe(paymentRef);
        });

        it('should not allow payout if status is not Approved', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);

            expect(() => refund.markAsPaidOut('PAY-REF-001')).toThrow(
                'Refund can only be marked as paid out if its status is Approved',
            );
        });

        it('should require a payment reference for payout', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.approve();

            expect(() => refund.markAsPaidOut('')).toThrow(
                'Payment reference is required to mark refund as paid out',
            );
        });

        it('should not allow a paid-out refund to be approved, rejected, or paid out again', () => {
            const refund = RefundEntity.request(bookingId, false, false, futureDeadline);
            refund.approve();
            refund.markAsPaidOut('PAY-REF-001');

            expect(() => refund.approve()).toThrow('Refund can only be approved if its status is Requested');
            expect(() => refund.reject('reason')).toThrow('Refund can only be rejected if its status is Requested');
            expect(() => refund.markAsPaidOut('PAY-REF-002')).toThrow('Refund can only be marked as paid out if its status is Approved');
        });
    });

    describe('RefundStatus Value Object', () => {
        it('should create valid statuses', () => {
            expect(RefundStatus.create('Requested').value).toBe('Requested');
            expect(RefundStatus.create('Approved').value).toBe('Approved');
            expect(RefundStatus.create('Rejected').value).toBe('Rejected');
            expect(RefundStatus.create('PaidOut').value).toBe('PaidOut');
        });

        it('should throw on invalid status', () => {
            expect(() => RefundStatus.create('InvalidStatus')).toThrow(
                'Invalid refund status',
            );
        });

        it('should correctly compare equality', () => {
            expect(RefundStatus.REQUESTED.equals(RefundStatus.REQUESTED)).toBe(true);
            expect(RefundStatus.REQUESTED.equals(RefundStatus.APPROVED)).toBe(false);
        });
    });

    describe('Reconstitution', () => {
        it('should reconstitute a refund from persistence without raising events', () => {
            const refund = RefundEntity.reconstitute({
                id: 'existing-id',
                bookingId,
                status: RefundStatus.APPROVED,
            });

            expect(refund.id).toBe('existing-id');
            expect(refund.status.equals(RefundStatus.APPROVED)).toBe(true);
            expect(refund.domainEvents).toHaveLength(0);
        });
    });
});
