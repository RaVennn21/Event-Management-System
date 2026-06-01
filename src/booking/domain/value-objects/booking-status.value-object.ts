export enum BookingStatusEnum {
  PENDING_PAYMENT = 'PendingPayment',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
  EXPIRED = 'Expired',
}

export class BookingStatus {
  private constructor(public readonly value: BookingStatusEnum) {}

  public static createPendingPayment(): BookingStatus {
    return new BookingStatus(BookingStatusEnum.PENDING_PAYMENT);
  }

  public static createPaid(): BookingStatus {
    return new BookingStatus(BookingStatusEnum.PAID);
  }

  public static createCancelled(): BookingStatus {
    return new BookingStatus(BookingStatusEnum.CANCELLED);
  }

  public static createExpired(): BookingStatus {
    return new BookingStatus(BookingStatusEnum.EXPIRED);
  }

  public static reconstitute(value: string): BookingStatus {
    return new BookingStatus(value as BookingStatusEnum);
  }
}
