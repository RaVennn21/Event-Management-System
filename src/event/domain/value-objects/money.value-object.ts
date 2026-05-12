
export class Money {
    private readonly _amount: number;
    private readonly _currency: string;

    private constructor(amount: number, currency: string) {
        this._amount = amount;
        this._currency = currency;
    }

    public static create(amount: number, currency: string = 'IDR'): Money {
        if (amount < 0) {
            throw new Error('Ticket price cannot be less than zero.');
        }

        if (!currency || currency.trim().length === 0) {
            throw new Error('Currency must be provided.');
        }

        return new Money(amount, currency);
    }

    get amount(): number { return this._amount; }
    get currency(): string { return this._currency; }

    public equals(other: Money): boolean {
        return (
            other !== null &&
            this._amount === other.amount &&
            this._currency === other.currency
        );
    }
}