import { Booking } from '../../domain/entities/booking.aggregate-root';

export const I_BOOKING_REPOSITORY = 'IBookingRepository';

export interface IBookingRepository {
  save(booking: Booking): Promise<void>;
  findActiveBookingByCustomerAndEvent(customerId: string, eventId: string): Promise<Booking | null>;
}
