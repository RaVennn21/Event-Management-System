export class SalesPeriod {
    private readonly _startDate: Date;
    private readonly _endDate: Date;

    private constructor(startDate: Date, endDate: Date) {
        this._startDate = startDate;
        this._endDate = endDate;
    }

    public static create(startDate: Date, endDate: Date): SalesPeriod {
        if (endDate < startDate) {
            throw new Error('Sales end date cannot be earlier than sales start date.');
        }
        return new SalesPeriod(startDate, endDate);
    }

    get startDate(): Date { return this._startDate; }
    get endDate(): Date { return this._endDate; }
}