export class TicketReserved {
  constructor(
    public readonly bookingId: string,
    public readonly eventId: string,
    public readonly ticketCategoryId: string,
    public readonly quantity: number,
    public readonly customerId: string,
    public readonly paymentDeadline: Date,
  ) {}
}
