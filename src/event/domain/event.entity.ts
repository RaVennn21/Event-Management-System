export enum EventStatus {
    DRAFT = 'Draft',
    PUBLISHED = 'Published',
    CANCELLED = 'Cancelled',
    COMPLETED = 'Completed'
}

export class EventCreated {
    constructor(public readonly eventId: string) { }
}

export class Event {
    private _id: string;
    private _name: string;
    private _description: string;
    private _startDate: Date;
    private _endDate: Date;
    private _location: string;
    private _maximumCapacity: number;
    private _status: EventStatus;
    private _domainEvents: any[] = [];

    private constructor(
        id: string,
        name: string,
        description: string,
        startDate: Date,
        endDate: Date,
        location: string,
        maximumCapacity: number,
        status: EventStatus
    ) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._startDate = startDate;
        this._endDate = endDate;
        this._location = location;
        this._maximumCapacity = maximumCapacity;
        this._status = status;
    }

    public static create(
        name: string,
        description: string,
        startDate: Date,
        endDate: Date,
        location: string,
        maximumCapacity: number
    ): Event {
        if (endDate < startDate) {
            throw new Error('Tanggal selesai tidak boleh lebih awal dari tanggal mulai.');
        }

        if (maximumCapacity <= 0) {
            throw new Error('Kapasitas maksimum harus lebih besar dari nol.');
        }

        const id = crypto.randomUUID();

        const event = new Event(
            id,
            name,
            description,
            startDate,
            endDate,
            location,
            maximumCapacity,
            EventStatus.DRAFT
        );

        event.addDomainEvent(new EventCreated(id));

        return event;
    }

    get id(): string { return this._id; }
    get status(): EventStatus { return this._status; }
    get domainEvents(): any[] { return [...this._domainEvents]; }

    private addDomainEvent(domainEvent: any): void {
        this._domainEvents.push(domainEvent);
    }

    public clearDomainEvents(): void {
        this._domainEvents = [];
    }
}