import { TicketCode } from '../value-objects/ticket-code.value-object';
import { TicketStatus } from '../value-objects/ticket-status.value-object';

export interface TicketProps {
    ticketCode: TicketCode;    // Value Object
    eventId: string;           // Primitive Data Type
    bookingId: string;         // Primitive Data Type (Baru)
    status: TicketStatus;      // Enum / Value Object
}

export class TicketEntity {
    private readonly _ticketCode: TicketCode;
    private readonly _eventId: string;
    private readonly _bookingId: string;
    private _status: TicketStatus;

    private constructor(props: TicketProps) {
        this._ticketCode = props.ticketCode;
        this._eventId = props.eventId;
        this._bookingId = props.bookingId;
        this._status = props.status;
    }

    // Factory Method
    public static create(props: TicketProps): TicketEntity {
        return new TicketEntity(props);
    }

    // Getters
    get ticketCode(): string { return this._ticketCode.value; }
    get eventId(): string { return this._eventId; }
    get bookingId(): string { return this._bookingId; }
    get status(): TicketStatus { return this._status; }

    // ----------------------------------------------------------------
    // DOMAIN BEHAVIORS (Sesuai User Stories)
    // ----------------------------------------------------------------

    /**
     * User Story 13 & 14: Check In Ticket & Reject Invalid Ticket
     */
    public checkIn(eventId: string): void {
        if (this._status === TicketStatus.CHECKED_IN) {
            throw new Error('Ticket has already been used'); // [cite: 180, 190]
        }

        if (this._status === TicketStatus.CANCELLED) {
            throw new Error('Event has been cancelled'); // [cite: 193]
        }

        if (this._status === TicketStatus.REFUND_REQUIRED) {
            throw new Error('Ticket requires a refund and cannot be used');
        }

        if (this._eventId !== eventId) {
            throw new Error('Ticket does not match the event'); // [cite: 178, 192]
        }

        // Jika lolos semua validasi
        this._status = TicketStatus.CHECKED_IN; // [cite: 183]
    }

    /**
     * User Story 16: Approve Refund
     * Related tickets are changed to Cancelled.
     */
    public cancel(): void {
        if (this._status === TicketStatus.CHECKED_IN) {
            throw new Error('Cannot cancel a ticket that has already been checked in'); // [cite: 200]
        }
        this._status = TicketStatus.CANCELLED; // [cite: 213]
    }

    /**
     * User Story 3 & 12: Cancel Event
     * Tickets from cancelled events must have the status Cancelled or Refund Required.
     */
    public requireRefund(): void {
        if (this._status === TicketStatus.CHECKED_IN) {
            throw new Error('Checked-in ticket cannot require refund');
        }
        this._status = TicketStatus.REFUND_REQUIRED; // [cite: 174]
    }
}