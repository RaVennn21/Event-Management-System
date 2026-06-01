import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { I_EVENT_REPOSITORY } from './domain/repositories/event.repository.interface';
import { EVENT_QUERY_REPOSITORY } from './application/interfaces/event-query.repository.interface';
import { PrismaEventRepository } from './infrastructure/repositories/prisma-event.repository';
import { PrismaEventQueryRepository } from './infrastructure/repositories/prisma-event-query.repository';
import { GetAvailableEventsHandler } from './application/queries/get-available-events.handler';
import { GetEventDetailsHandler } from './application/queries/get-event-details.handler';

const QueryHandlers = [GetAvailableEventsHandler, GetEventDetailsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [EventController],
  providers: [
    EventService,
    ...QueryHandlers,
    {
      provide: I_EVENT_REPOSITORY,
      useClass: PrismaEventRepository,
    },
    {
      provide: EVENT_QUERY_REPOSITORY,
      useClass: PrismaEventQueryRepository,
    },
  ],
})
export class EventModule {}
