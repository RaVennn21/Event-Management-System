import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { Event } from '../../domain/entities/event.entity';
import { EventMapper } from '../mappers/event.mapper';

@Injectable()
export class PrismaEventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(event: Event): Promise<void> {
    const data = EventMapper.toPersistence(event);

    await this.prisma.$transaction(async (tx) => {
      // 1. Upsert the Event
      await tx.event.upsert({
        where: { id: data.id },
        update: {
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          maximumCapacity: data.maximumCapacity,
          status: data.status,
        },
        create: {
          id: data.id,
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          location: data.location,
          maximumCapacity: data.maximumCapacity,
          status: data.status,
        },
      });

      // 2. Upsert each Ticket Category
      for (const category of data.ticketCategories) {
        await tx.ticketCategory.upsert({
          where: { id: category.id },
          update: {
            name: category.name,
            priceAmount: category.priceAmount,
            priceCurrency: category.priceCurrency,
            quota: category.quota,
            salesStartDate: category.salesStartDate,
            salesEndDate: category.salesEndDate,
            isActive: category.isActive,
          },
          create: {
            id: category.id,
            eventId: category.eventId,
            name: category.name,
            priceAmount: category.priceAmount,
            priceCurrency: category.priceCurrency,
            quota: category.quota,
            salesStartDate: category.salesStartDate,
            salesEndDate: category.salesEndDate,
            isActive: category.isActive,
          },
        });
      }
    });
  }

  async findById(id: string): Promise<Event | null> {
    const record = await this.prisma.event.findUnique({
      where: { id },
      include: { ticketCategories: true },
    });

    if (!record) return null;

    return EventMapper.toDomain(record);
  }
}
