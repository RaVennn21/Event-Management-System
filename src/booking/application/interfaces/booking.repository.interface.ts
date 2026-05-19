import { Booking } from '../../domain/entities/booking.aggregate-root';

export const I_BOOKING_REPOSITORY = 'IBookingRepository';

export interface IBookingRepository {
  save(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
  findActiveBookingByCustomerAndEvent(customerId: string, eventId: string): Promise<Booking | null>;
}
