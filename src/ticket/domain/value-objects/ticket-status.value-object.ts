// Kita tetap menyimpan daftar status valid sebagai Enum/Konstanta internal
export enum ValidStatuses {
  ACTIVE = 'Active',
  CHECKED_IN = 'CheckedIn',
  CANCELLED = 'Cancelled',
  REFUND_REQUIRED = 'RefundRequired',
}

export class TicketStatus {
  private readonly _value: ValidStatuses;

  private constructor(value: ValidStatuses) {
    this._value = value;
  }

  get value(): ValidStatuses {
    return this._value;
  }

  // Factory method dengan VALIDASI RUNTIME
  public static create(statusStr: string): TicketStatus {
    if (!statusStr || statusStr.trim() === '') {
      throw new Error('Ticket status cannot be empty');
    }

    // Validasi: Mengecek apakah string yang masuk ada di dalam daftar ValidStatuses
    const validValues = Object.values(ValidStatuses) as string[];

    if (!validValues.includes(statusStr)) {
      throw new Error(`Invalid ticket status: '${statusStr}'. Allowed values are: ${validValues.join(', ')}`);
    }

    return new TicketStatus(statusStr as ValidStatuses);
  }

  // Method helper untuk membandingkan status tanpa perlu mengekspos internal value-nya
  public is(status: ValidStatuses): boolean {
    return this._value === status;
  }

  public equals(other: TicketStatus): boolean {
    if (!other) return false;
    return this._value === other.value;
  }
}