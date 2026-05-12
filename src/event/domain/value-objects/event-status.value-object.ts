export enum EventStatusEnum {
    DRAFT = 'Draft',
    PUBLISHED = 'Published',
    CANCELLED = 'Cancelled',
    COMPLETED = 'Completed'
}

export class EventStatus {
    private readonly _value: EventStatusEnum;

    private constructor(value: EventStatusEnum) {
        this._value = value;
    }

    public static createDraft(): EventStatus {
        return new EventStatus(EventStatusEnum.DRAFT);
    }
    public publish(): EventStatus {
        if (this._value === EventStatusEnum.CANCELLED) {
            throw new Error('A cancelled event cannot be published.');
        }

        if (this._value !== EventStatusEnum.DRAFT) {
            throw new Error('Only draft events can be published.');
        }

        return new EventStatus(EventStatusEnum.PUBLISHED);
    }

    public cancel(): EventStatus {
        if (this._value === EventStatusEnum.COMPLETED) {
            throw new Error('A completed event cannot be cancelled.');
        }

        if (this._value === EventStatusEnum.CANCELLED) {
            throw new Error('The event is already cancelled.');
        }

        return new EventStatus(EventStatusEnum.CANCELLED);
    }
    get value(): EventStatusEnum {
        return this._value;
    }

    public equals(other: EventStatus): boolean {
        return other !== null && this._value === other.value;
    }
}