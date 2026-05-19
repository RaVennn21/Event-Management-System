import { randomUUID } from 'crypto';
import { BookingStatus, BookingStatusEnum } from '../value-objects/booking-status.value-object';
import { TicketReserved } from '../events/ticket-reserved.domain-event';
import { BookingPaid } from '../events/booking-paid.domain-event';
import { BookingExpired } from '../events/booking-expired.domain-event';
import { Ticket } from './ticket.entity';
import { Money } from '../../../event/domain/value-objects/money.value-object';

export class Booking {
  private _id: string;
  private _eventId: string;
  private _ticketCategoryId: string;
  private _customerId: string;
  private _quantity: number;
  private _status: BookingStatus;
  private _createdAt: Date;
  private _paymentDeadline: Date;
  private _totalPrice: Money;
  private _tickets: Ticket[] = [];
  private _domainEvents: any[] = [];

  private constructor(
    id: string,
    eventId: string,
    ticketCategoryId: string,
    customerId: string,
    quantity: number,
    status: BookingStatus,
    createdAt: Date,
    paymentDeadline: Date,
    totalPrice: Money
  ) {
    this._id = id;
    this._eventId = eventId;
    this._ticketCategoryId = ticketCategoryId;
    this._customerId = customerId;
    this._quantity = quantity;
    this._status = status;
    this._createdAt = createdAt;
    this._paymentDeadline = paymentDeadline;
    this._totalPrice = totalPrice;
  }

  public static create(
    eventId: string,
    ticketCategoryId: string,
    customerId: string,
    quantity: number,
    paymentDeadline: Date,
    unitPrice: Money,
    serviceFee?: Money
  ): Booking {
    const id = randomUUID();
    const status = BookingStatus.createPendingPayment();
    const createdAt = new Date();

    const totalAmount = (unitPrice.amount * quantity) + (serviceFee ? serviceFee.amount : 0);
    const totalPrice = Money.create(totalAmount, unitPrice.currency);

    const booking = new Booking(
      id,
      eventId,
      ticketCategoryId,
      customerId,
      quantity,
      status,
      createdAt,
      paymentDeadline,
      totalPrice
    );

    booking.addDomainEvent(
      new TicketReserved(
        id,
        eventId,
        ticketCategoryId,
        quantity,
        customerId,
        paymentDeadline
      )
    );

    return booking;
  }

  get id(): string { return this._id; }
  get eventId(): string { return this._eventId; }
  get ticketCategoryId(): string { return this._ticketCategoryId; }
  get customerId(): string { return this._customerId; }
  get quantity(): number { return this._quantity; }
  get status(): BookingStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get paymentDeadline(): Date { return this._paymentDeadline; }
  get totalPrice(): Money { return this._totalPrice; }
  get tickets(): Ticket[] { return [...this._tickets]; }
  get domainEvents(): any[] { return [...this._domainEvents]; }

  public pay(paymentAmount: Money, currentTime: Date): void {
    if (this._status.value !== BookingStatusEnum.PENDING_PAYMENT) {
      throw new Error('A booking can only be paid if its status is Pending Payment.');
    }

    if (currentTime > this._paymentDeadline) {
      throw new Error('A booking cannot be paid if the payment deadline has passed.');
    }

    if (!this._totalPrice.equals(paymentAmount)) {
      throw new Error('The payment amount must be equal to the total booking price.');
    }

    this._status = BookingStatus.createPaid();

    for (let i = 0; i < this._quantity; i++) {
      this._tickets.push(Ticket.issue());
    }

    this.addDomainEvent(new BookingPaid(this.id));
  }

  public expire(currentTime: Date): void {
    if (this._status.value !== BookingStatusEnum.PENDING_PAYMENT) {
      throw new Error('A booking with the status Paid or Cancelled cannot be marked as expired.');
    }

    if (currentTime <= this._paymentDeadline) {
      throw new Error('A booking cannot be expired before its payment deadline has passed.');
    }

    this._status = BookingStatus.createExpired();

    this.addDomainEvent(
      new BookingExpired(
        this.id,
        this.eventId,
        this.ticketCategoryId,
        this.quantity
      )
    );
  }

  private addDomainEvent(domainEvent: any): void {
    this._domainEvents.push(domainEvent);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
