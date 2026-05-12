import { randomUUID } from 'crypto';
import { EventSchedule } from '../value-objects/event-schedule.value-object';
import { EventCapacity } from '../value-objects/event-capacity.value-object';
import { EventStatus, EventStatusEnum } from '../value-objects/event-status.value-object';
import { EventPublished } from '../events/event-published.domain-event';
import { TicketCategory } from './ticket-category.entity';
import { TicketCategoryCreated } from '../events/ticket-category-created.domain-event';
import { TicketCategoryDisabled } from '../events/ticket-category-disabled.domain-event';

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
  private _ticketCategories: TicketCategory[] = [];
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

  public publish(): void {
    const activeCategories = this._ticketCategories.filter(tc => tc.isActive);
    if (activeCategories.length === 0) {
      throw new Error('Event tidak bisa dipublish karena tidak memiliki kategori tiket yang aktif.');
    }

    const totalQuota = this._ticketCategories.reduce((sum, tc) => sum + tc.quota, 0);
    if (totalQuota > this._maximumCapacity.value) {
      throw new Error('Total kuota kategori tiket melebihi kapasitas maksimum event.');
    }

    this._status = this._status.publish();

    this.addDomainEvent(new EventPublished(this.id));
  }

  public addTicketCategory(
    name: string,
    priceAmount: number,
    priceCurrency: string,
    quotaValue: number,
    salesStartDate: Date,
    salesEndDate: Date
  ): void {

    const currentTotalQuota = this._ticketCategories.reduce((sum, tc) => sum + tc.quota, 0);

    if (currentTotalQuota + quotaValue > this.capacity) {
      throw new Error('The total quota of all ticket categories must not exceed the maximum event capacity.'); // 
    }

    const newCategory = TicketCategory.create(
      name,
      priceAmount,
      priceCurrency,
      quotaValue,
      salesStartDate,
      salesEndDate,
      this.schedule.startDate
    );

    this._ticketCategories.push(newCategory);

    this.addDomainEvent(new TicketCategoryCreated(this.id, newCategory.id));
  }
  public disableTicketCategory(categoryId: string): void {
    if (this._status.value === EventStatusEnum.COMPLETED) {
      throw new Error('Cannot disable a ticket category because the event is already completed.');
    }

    const category = this._ticketCategories.find(tc => tc.id === categoryId);
    if (!category) {
      throw new Error('Ticket category not found.');
    }

    category.disable();

    this.addDomainEvent(new TicketCategoryDisabled(this.id, category.id));
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