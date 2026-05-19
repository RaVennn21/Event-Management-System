export class GetAvailableEventsQuery {
  constructor(
    public readonly date?: Date,
    public readonly location?: string,
  ) {}
}
