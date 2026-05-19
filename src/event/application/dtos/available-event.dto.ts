export class AvailableEventDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly date: Date,
    public readonly location: string,
    public readonly lowestTicketPrice: number,
  ) {}
}
