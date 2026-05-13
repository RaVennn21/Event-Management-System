export class TicketCode {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    public static create(value: string): TicketCode {
        if (!value || value.trim().length === 0) {
            throw new Error('Ticket code cannot be empty');
        }

        return new TicketCode(value.trim());
    }

    get value(): string {
        return this._value;
    }
}