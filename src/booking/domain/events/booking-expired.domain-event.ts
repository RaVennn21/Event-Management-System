export class BookingExpired {
  constructor(
    public readonly bookingId: string,
    public readonly eventId: string,
    public readonly ticketCategoryId: string,
    public readonly quantity: number,
  ) {}
}
