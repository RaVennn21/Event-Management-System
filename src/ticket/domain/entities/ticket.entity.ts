import { TicketCode } from '../value-objects/ticket-code.value-object';
import { TicketStatus, ValidStatuses } from '../value-objects/ticket-status.value-object';

export interface TicketProps {
  ticketCode: TicketCode;
  eventId: string;
  bookingId: string;
  status: TicketStatus;
}

export class TicketEntity {
  private readonly _ticketCode: TicketCode;
  private readonly _eventId: string;
  private readonly _bookingId: string;
  private _status: TicketStatus;

  // 1. Constructor harus ada (bersifat private)
  private constructor(props: TicketProps) {
    this._ticketCode = props.ticketCode;
    this._eventId = props.eventId;
    this._bookingId = props.bookingId;
    this._status = props.status;
  }

  // 2. INI ADALAH METHOD YANG MEMBUAT ERROR HILANG (Factory Method)
  public static create(props: TicketProps): TicketEntity {
    return new TicketEntity(props);
  }

  // 3. Getters
  get ticketCode(): string { return this._ticketCode.value; }
  get eventId(): string { return this._eventId; }
  get bookingId(): string { return this._bookingId; }
  get status(): TicketStatus { return this._status; }

  // 4. Domain Behaviors
  public checkIn(eventId: string): void {
    if (this._status.is(ValidStatuses.CHECKED_IN)) {
      throw new Error('Ticket has already been used');
    }

    if (this._status.is(ValidStatuses.CANCELLED)) {
      throw new Error('Event has been cancelled');
    }

    if (this._status.is(ValidStatuses.REFUND_REQUIRED)) {
      throw new Error('Ticket requires a refund and cannot be used');
    }

    if (this._eventId !== eventId) {
      throw new Error('Ticket does not match the event');
    }

    this._status = TicketStatus.create(ValidStatuses.CHECKED_IN);
  }

  public cancel(): void {
    if (this._status.is(ValidStatuses.CHECKED_IN)) {
      throw new Error('Cannot cancel a ticket that has already been checked in');
    }
    this._status = TicketStatus.create(ValidStatuses.CANCELLED);
  }

  public requireRefund(): void {
    if (this._status.is(ValidStatuses.CHECKED_IN)) {
      throw new Error('Checked-in ticket cannot require refund');
    }
    this._status = TicketStatus.create(ValidStatuses.REFUND_REQUIRED);
  }
}