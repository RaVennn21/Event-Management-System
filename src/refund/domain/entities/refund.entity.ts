import { AggregateRoot } from './aggregate-root.base';
import { RefundStatus } from '../value-objects/refund-status.value-object';
import { RefundRequested } from '../events/refund-requested.event';
import { RefundApproved } from '../events/refund-approved.event';
import { RefundRejected } from '../events/refund-rejected.event';
import { RefundPaidOut } from '../events/refund-paid-out.event';

export interface RefundProps {
    id: string;
    bookingId: string;
    status: RefundStatus;
    rejectionReason?: string;
    paymentReference?: string;
}

export class RefundEntity extends AggregateRoot {
    private readonly _id: string;
    private readonly _bookingId: string;
    private _status: RefundStatus;
    private _rejectionReason?: string;
    private _paymentReference?: string;

    private constructor(props: RefundProps) {
        super();
        this._id = props.id;
        this._bookingId = props.bookingId;
        this._status = props.status;
        this._rejectionReason = props.rejectionReason;
        this._paymentReference = props.paymentReference;
    }

    public static request(
        bookingId: string,
        isEventCancelled: boolean,
        hasCheckedInTickets: boolean,
        deadline: Date,
    ): RefundEntity {
        if (hasCheckedInTickets) {
            throw new Error('Refund cannot be requested if ticket has already been checked in');
        }

        if (!isEventCancelled) {
            const now = new Date();
            if (now > deadline) {
                throw new Error('Refund cannot be requested after the refund deadline');
            }
        }

        const id = crypto.randomUUID();

        const refund = new RefundEntity({
            id,
            bookingId,
            status: RefundStatus.REQUESTED,
        });

        refund.addDomainEvent(new RefundRequested(id, bookingId));

        return refund;
    }

    public static reconstitute(props: RefundProps): RefundEntity {
        return new RefundEntity(props);
    }

    get id(): string {
        return this._id;
    }

    get bookingId(): string {
        return this._bookingId;
    }

    get status(): RefundStatus {
        return this._status;
    }

    get rejectionReason(): string | undefined {
        return this._rejectionReason;
    }

    get paymentReference(): string | undefined {
        return this._paymentReference;
    }

    public approve(): void {
        if (!this._status.equals(RefundStatus.REQUESTED)) {
            throw new Error('Refund can only be approved if its status is Requested');
        }

        this._status = RefundStatus.APPROVED;
        this.addDomainEvent(new RefundApproved(this._id, this._bookingId));
    }

    public reject(reason: string): void {
        if (!this._status.equals(RefundStatus.REQUESTED)) {
            throw new Error('Refund can only be rejected if its status is Requested');
        }

        if (!reason || reason.trim().length === 0) {
            throw new Error('Rejected refund must have a rejection reason');
        }

        this._status = RefundStatus.REJECTED;
        this._rejectionReason = reason;
        this.addDomainEvent(
            new RefundRejected(this._id, this._bookingId, reason),
        );
    }

    public markAsPaidOut(paymentReference: string): void {
        if (!this._status.equals(RefundStatus.APPROVED)) {
            throw new Error('Refund can only be marked as paid out if its status is Approved');
        }

        if (!paymentReference || paymentReference.trim().length === 0) {
            throw new Error('Payment reference is required to mark refund as paid out');
        }

        this._status = RefundStatus.PAID_OUT;
        this._paymentReference = paymentReference;
        this.addDomainEvent(
            new RefundPaidOut(this._id, this._bookingId, paymentReference),
        );
    }
}
