export enum BookingStatusEnum {
  PENDING_PAYMENT = 'PendingPayment',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
}

export class BookingStatus {
  private constructor(public readonly value: BookingStatusEnum) {}

  public static createPendingPayment(): BookingStatus {
    return new BookingStatus(BookingStatusEnum.PENDING_PAYMENT);
  }

  public static createConfirmed(): BookingStatus {
    return new BookingStatus(BookingStatusEnum.CONFIRMED);
  }

  public static createCancelled(): BookingStatus {
    return new BookingStatus(BookingStatusEnum.CANCELLED);
  }
}
