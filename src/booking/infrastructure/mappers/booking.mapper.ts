import { Booking as PrismaBooking, Ticket as PrismaTicket } from '../../../../generated/prisma/client';
import { Booking } from '../../domain/entities/booking.aggregate-root';
import { Ticket } from '../../domain/entities/ticket.entity';

type PrismaBookingWithTickets = PrismaBooking & {
  tickets: PrismaTicket[];
};

export class BookingMapper {
  public static toDomain(prismaBooking: PrismaBookingWithTickets): Booking {
    const tickets = prismaBooking.tickets.map(t => Ticket.reconstitute(t.id, t.ticketCode));

    return Booking.reconstitute(
      prismaBooking.id,
      prismaBooking.eventId,
      prismaBooking.ticketCategoryId,
      prismaBooking.customerId,
      prismaBooking.quantity,
      prismaBooking.status,
      prismaBooking.createdAt,
      prismaBooking.paymentDeadline,
      prismaBooking.totalPriceAmount,
      prismaBooking.totalPriceCurrency,
      tickets
    );
  }

  public static toPersistence(booking: Booking) {
    return {
      id: booking.id,
      eventId: booking.eventId,
      ticketCategoryId: booking.ticketCategoryId,
      customerId: booking.customerId,
      quantity: booking.quantity,
      status: booking.status.value,
      createdAt: booking.createdAt,
      paymentDeadline: booking.paymentDeadline,
      totalPriceAmount: booking.totalPrice.amount,
      totalPriceCurrency: booking.totalPrice.currency,
      tickets: booking.tickets.map(t => ({
        id: t.id,
        bookingId: booking.id,
        ticketCode: t.code,
        status: 'Active', 
      })),
    };
  }
}
