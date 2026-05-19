export class CreateBookingCommand {
  constructor(
    public readonly eventId: string,
    public readonly ticketCategoryId: string,
    public readonly customerId: string,
    public readonly quantity: number,
  ) {}
}
