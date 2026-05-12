export class EventSchedule {
    private readonly _startDate: Date;
    private readonly _endDate: Date;

    private constructor(startDate: Date, endDate: Date) {
        this._startDate = startDate;
        this._endDate = endDate;
    }

    public static create(startDate: Date, endDate: Date): EventSchedule {
        if (endDate < startDate) {
            throw new Error('The finish date cannot be earlier than the start date');
        }

        return new EventSchedule(startDate, endDate);
    }

    get startDate(): Date {
        return this._startDate;
    }

    get endDate(): Date {
        return this._endDate;
    }

    // Value Object sering kali punya method untuk mengecek kesamaan nilai
    public equals(other: EventSchedule): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        return (
            this._startDate.getTime() === other.startDate.getTime() &&
            this._endDate.getTime() === other.endDate.getTime()
        );
    }
}