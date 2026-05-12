export class RefundStatus {
    private static readonly VALID_STATUSES = [
        'Requested',
        'Approved',
        'Rejected',
        'PaidOut',
    ] as const;

    public static readonly REQUESTED = new RefundStatus('Requested');
    public static readonly APPROVED = new RefundStatus('Approved');
    public static readonly REJECTED = new RefundStatus('Rejected');
    public static readonly PAID_OUT = new RefundStatus('PaidOut');

    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    public static create(value: string): RefundStatus {
        if (!RefundStatus.VALID_STATUSES.includes(value as any)) {
            throw new Error(
                `Invalid refund status: "${value}". Valid statuses are: ${RefundStatus.VALID_STATUSES.join(', ')}`,
            );
        }
        return new RefundStatus(value);
    }

    get value(): string {
        return this._value;
    }

    public equals(other: RefundStatus): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        return this._value === other.value;
    }

    public toString(): string {
        return this._value;
    }
}
