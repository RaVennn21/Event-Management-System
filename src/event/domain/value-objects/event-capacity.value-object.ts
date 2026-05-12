
export class EventCapacity {
    private readonly _value: number;

    private constructor(value: number) {
        this._value = value;
    }

    public static create(value: number): EventCapacity {
        if (value <= 0) {
            throw new Error('Max Capacity must be greater than 0');
        }

        return new EventCapacity(value);
    }

    get value(): number {
        return this._value;
    }

    public equals(other: EventCapacity): boolean {
        return other !== null && other !== undefined && this._value === other.value;
    }
}