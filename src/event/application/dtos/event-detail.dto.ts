export class TicketCategoryDetailDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly currency: string,
    public readonly status: 'Active' | 'Coming Soon' | 'Sales Closed' | 'Sold Out',
  ) {}
}

export class EventDetailDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly location: string,
    public readonly organizer: string,
    public readonly ticketCategories: TicketCategoryDetailDto[],
  ) {}
}
