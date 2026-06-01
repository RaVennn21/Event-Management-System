import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IEventQueryRepository } from '../../application/interfaces/event-query.repository.interface';
import { AvailableEventDto } from '../../application/dtos/available-event.dto';
import { EventDetailDto, TicketCategoryDetailDto } from '../../application/dtos/event-detail.dto';
import { GetAvailableEventsQuery } from '../../application/queries/get-available-events.query';

@Injectable()
export class PrismaEventQueryRepository implements IEventQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableEvents(query: GetAvailableEventsQuery): Promise<AvailableEventDto[]> {
    const events = await this.prisma.event.findMany({
      where: {
        status: 'Published', // Only published events are available to customers
      },
      include: {
        ticketCategories: {
          where: { isActive: true }
        }
      }
    });

    return events.map(event => {
      // Find the lowest ticket price among active categories
      const lowestPrice = event.ticketCategories.length > 0
        ? Math.min(...event.ticketCategories.map(tc => tc.priceAmount))
        : 0;

      return new AvailableEventDto(
        event.id,
        event.name,
        event.startDate,
        event.location,
        lowestPrice
      );
    });
  }

  async getEventDetails(eventId: string): Promise<EventDetailDto> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketCategories: true,
      }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const categoryDtos = event.ticketCategories.map(tc => {
      let status: 'Active' | 'Coming Soon' | 'Sales Closed' | 'Sold Out' = 'Active';
      const now = new Date();
      
      if (!tc.isActive) {
        status = 'Sales Closed';
      } else if (now < tc.salesStartDate) {
        status = 'Coming Soon';
      } else if (now > tc.salesEndDate) {
        status = 'Sales Closed';
      } else if (tc.quota <= 0) { 
        status = 'Sold Out';
      }

      return new TicketCategoryDetailDto(
        tc.id,
        tc.name,
        tc.priceAmount,
        tc.priceCurrency,
        status
      );
    });

    return new EventDetailDto(
      event.id,
      event.name,
      event.description,
      event.startDate,
      event.location,
      'Event Organizer', // Hardcoded placeholder for organizer name
      categoryDtos
    );
  }
}
