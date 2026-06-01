export interface BookingDetails {
  bookingId: string;
  isPaid: boolean;
  isEventCancelled: boolean;
  hasCheckedInTickets: boolean;
  eventDate: Date;
}

export interface IBookingValidationService {
  getBookingDetails(bookingId: string): Promise<BookingDetails>;
}
