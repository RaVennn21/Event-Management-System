export enum BookingStatusEnum {
  PENDING_PAYMENT = 'PendingPayment',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
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
}
