export class TicketCategoryCreated {
    constructor(
        public readonly eventId: string,
        public readonly ticketCategoryId: string
    ) { }
}