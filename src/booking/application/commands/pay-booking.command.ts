export class PayBookingCommand {
  constructor(
    public readonly bookingId: string,
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}
