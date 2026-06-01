import { randomUUID } from 'crypto';

export class Ticket {
  private _id: string;
  private _code: string;

  private constructor(id: string, code: string) {
    this._id = id;
    this._code = code;
  }

  public static issue(): Ticket {
    const id = randomUUID();
    const code = randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
    return new Ticket(id, code);
  }

  public static reconstitute(id: string, code: string): Ticket {
    return new Ticket(id, code);
  }

  get id(): string { return this._id; }
  get code(): string { return this._code; }
}
