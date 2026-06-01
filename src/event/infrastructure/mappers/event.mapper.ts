import { Event as PrismaEvent, TicketCategory as PrismaTicketCategory } from '../../../../generated/prisma/client';
import { Event } from '../../domain/entities/event.entity';
import { TicketCategory } from '../../domain/entities/ticket-category.entity';

type PrismaEventWithCategories = PrismaEvent & {
  ticketCategories: PrismaTicketCategory[];
};

export class EventMapper {
  // Convert Prisma Model -> Domain Entity
  public static toDomain(prismaEvent: PrismaEventWithCategories): Event {
    const ticketCategories = prismaEvent.ticketCategories.map(tc =>
      TicketCategory.reconstitute(
        tc.id,
        tc.name,
        tc.priceAmount,
        tc.priceCurrency,
        tc.quota,
        tc.salesStartDate,
        tc.salesEndDate,
        tc.isActive
      )
    );

    return Event.reconstitute(
      prismaEvent.id,
      prismaEvent.name,
      prismaEvent.description,
      prismaEvent.startDate,
      prismaEvent.endDate,
      prismaEvent.location,
      prismaEvent.maximumCapacity,
      prismaEvent.status,
      ticketCategories
    );
  }

  // Convert Domain Entity -> Prisma Model data structure
  public static toPersistence(event: Event) {
    return {
      id: event.id,
      name: (event as any)._name, // Accessing private fields for persistence is common in DDD mappers
      description: (event as any)._description,
      startDate: event.schedule.startDate,
      endDate: event.schedule.endDate,
      location: (event as any)._location,
      maximumCapacity: event.capacity,
      status: event.status.value,
      ticketCategories: event.ticketCategories.map(tc => ({
        id: tc.id,
        eventId: event.id,
        name: tc.name,
        priceAmount: tc.price.amount,
        priceCurrency: tc.price.currency,
        quota: tc.quota,
        salesStartDate: tc.salesStartDate,
        salesEndDate: tc.salesEndDate,
        isActive: tc.isActive,
      })),
    };
  }
}
