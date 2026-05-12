export class TicketCategory {
    private _id: string;
    private _name: string;
    private _quota: number;
    private _isActive: boolean;

    constructor(id: string, name: string, quota: number, isActive: boolean = true) {
        this._id = id;
        this._name = name;
        this._quota = quota;
        this._isActive = isActive;
    }

    get quota(): number { return this._quota; }
    get isActive(): boolean { return this._isActive; }
}