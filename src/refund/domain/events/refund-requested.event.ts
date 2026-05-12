export class RefundRequested {
    public readonly occurredOn: Date;

    constructor(
        public readonly refundId: string,
        public readonly bookingId: string,
    ) {
        this.occurredOn = new Date();
    }
}
