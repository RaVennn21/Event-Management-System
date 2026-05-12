import { randomUUID } from 'crypto';
import { Money } from '../value-objects/money.value-object';
import { TicketQuota } from '../value-objects/ticket-quota.value-object';
import { SalesPeriod } from '../value-objects/sales-period.value-object';

export class TicketCategory {
    private _id: string;
    private _name: string;
    private _price: Money;
    private _quota: TicketQuota;
    private _salesPeriod: SalesPeriod;
    private _isActive: boolean;

    private constructor(
        id: string,
        name: string,
        price: Money,
        quota: TicketQuota,
        salesPeriod: SalesPeriod,
        isActive: boolean
    ) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._quota = quota;
        this._salesPeriod = salesPeriod;
        this._isActive = isActive;
    }

    public static create(
        name: string,
        priceAmount: number,
        priceCurrency: string,
        quotaValue: number,
        salesStartDate: Date,
        salesEndDate: Date,
        eventStartDate: Date
    ): TicketCategory {
        if (salesEndDate > eventStartDate) {
            throw new Error('Ticket sales period must end before or at the event start date.'); // 
        }

        const price = Money.create(priceAmount, priceCurrency);
        const quota = TicketQuota.create(quotaValue);
        const salesPeriod = SalesPeriod.create(salesStartDate, salesEndDate);
        const id = randomUUID();

        return new TicketCategory(id, name, price, quota, salesPeriod, true);
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get price(): Money { return this._price; }
    get quota(): number { return this._quota.value; }
    get isActive(): boolean { return this._isActive; }
    get salesEndDate(): Date { return this._salesPeriod.endDate; }
}