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

    public transitionTo(newStatus: EventStatusEnum): EventStatus {
        if (this._value === EventStatusEnum.CANCELLED && newStatus === EventStatusEnum.PUBLISHED) {
            throw new Error('Event yang sudah dibatalkan tidak bisa dipublikasikan.');
        }

        if (this._value === EventStatusEnum.COMPLETED && newStatus === EventStatusEnum.CANCELLED) {
            throw new Error('Event yang sudah selesai tidak bisa dibatalkan.');
        }

        return new EventStatus(newStatus);
    }

    get value(): EventStatusEnum {
        return this._value;
    }

    public equals(other: EventStatus): boolean {
        return other !== null && this._value === other.value;
    }
}