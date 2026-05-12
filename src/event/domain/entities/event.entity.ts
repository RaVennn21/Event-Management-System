import { randomUUID } from 'crypto';
import { EventSchedule } from '../value-objects/event-schedule.value-object';
import { EventCapacity } from '../value-objects/event-capacity.value-object';
import { EventStatus, EventStatusEnum } from '../value-objects/event-status.value-object';

export class EventCreated {
  constructor(public readonly eventId: string) { }
}

export class Event {
  private _id: string;
  private _name: string;
  private _description: string;
  private _schedule: EventSchedule;
  private _location: string;
  private _maximumCapacity: EventCapacity;
  private _status: EventStatus;
  private _domainEvents: any[] = [];

  private constructor(
    id: string,
    name: string,
    description: string,
    schedule: EventSchedule,
    location: string,
    maximumCapacity: EventCapacity,
    status: EventStatus
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._schedule = schedule;
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
    maxCapValue: number
  ): Event {
    const schedule = EventSchedule.create(startDate, endDate);
    const capacity = EventCapacity.create(maxCapValue);
    const status = EventStatus.createDraft();
    const id = randomUUID();

    const event = new Event(
      id,
      name,
      description,
      schedule,
      location,
      capacity,
      status,
    );

    event.addDomainEvent(new EventCreated(id));

    return event;
  }

  get id(): string { return this._id; }
  get schedule(): EventSchedule { return this._schedule; }
  get capacity(): number { return this._maximumCapacity.value; }
  get status(): EventStatus { return this._status; }
  get domainEvents(): any[] { return [...this._domainEvents]; }

  private addDomainEvent(domainEvent: any): void {
    this._domainEvents.push(domainEvent);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }
}