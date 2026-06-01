import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IBookingRepository } from '../../application/interfaces/booking.repository.interface';
import { Booking } from '../../domain/entities/booking.aggregate-root';
import { BookingMapper } from '../mappers/booking.mapper';

@Injectable()
export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(booking: Booking): Promise<void> {
    const data = BookingMapper.toPersistence(booking);

    await this.prisma.$transaction(async (tx) => {
      // Upsert the Booking
      await tx.booking.upsert({
        where: { id: data.id },
        update: {
          quantity: data.quantity,
          status: data.status,
          paymentDeadline: data.paymentDeadline,
          totalPriceAmount: data.totalPriceAmount,
          totalPriceCurrency: data.totalPriceCurrency,
        },
        create: {
          id: data.id,
          eventId: data.eventId,
          ticketCategoryId: data.ticketCategoryId,
          customerId: data.customerId,
          quantity: data.quantity,
          status: data.status,
          createdAt: data.createdAt,
          paymentDeadline: data.paymentDeadline,
          totalPriceAmount: data.totalPriceAmount,
          totalPriceCurrency: data.totalPriceCurrency,
        },
      });

      // Insert/Update Tickets created by this booking
      for (const ticket of data.tickets) {
        await tx.ticket.upsert({
          where: { id: ticket.id },
          update: {
            status: ticket.status,
          },
          create: {
            id: ticket.id,
            bookingId: ticket.bookingId,
            ticketCode: ticket.ticketCode,
            status: ticket.status,
          },
        });
      }
    });
  }

  async findById(id: string): Promise<Booking | null> {
    const record = await this.prisma.booking.findUnique({
      where: { id },
      include: { tickets: true },
    });

    if (!record) return null;

    return BookingMapper.toDomain(record);
  }

  async findActiveBookingByCustomerAndEvent(customerId: string, eventId: string): Promise<Booking | null> {
    const record = await this.prisma.booking.findFirst({
      where: {
        customerId,
        eventId,
        status: {
          in: ['PendingPayment', 'Paid']
        }
      },
      include: { tickets: true },
    });

    if (!record) return null;

    return BookingMapper.toDomain(record);
  }
}
