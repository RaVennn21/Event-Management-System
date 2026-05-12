export class TicketQuota {
    private readonly _value: number;

    private constructor(value: number) {
        this._value = value;
    }

    public static create(value: number): TicketQuota {
        if (value <= 0) {
            throw new Error('Ticket quota must be greater than zero.'); // 
        }
        return new TicketQuota(value);
    }

    get value(): number { return this._value; }
}