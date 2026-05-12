export abstract class AggregateRoot {
    private _domainEvents: any[] = [];

    get domainEvents(): any[] {
        return [...this._domainEvents];
    }

    protected addDomainEvent(event: any): void {
        this._domainEvents.push(event);
    }

    public clearDomainEvents(): void {
        this._domainEvents = [];
    }
}
