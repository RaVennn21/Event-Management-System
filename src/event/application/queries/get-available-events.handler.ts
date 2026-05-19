import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAvailableEventsQuery } from './get-available-events.query';
import { AvailableEventDto } from '../dtos/available-event.dto';
import { EVENT_QUERY_REPOSITORY } from '../interfaces/event-query.repository.interface';
import type { IEventQueryRepository } from '../interfaces/event-query.repository.interface';

@QueryHandler(GetAvailableEventsQuery)
export class GetAvailableEventsHandler implements IQueryHandler<GetAvailableEventsQuery, AvailableEventDto[]> {
  constructor(
    @Inject(EVENT_QUERY_REPOSITORY)
    private readonly eventQueryRepository: IEventQueryRepository,
  ) {}

  async execute(query: GetAvailableEventsQuery): Promise<AvailableEventDto[]> {
    return this.eventQueryRepository.getAvailableEvents(query);
  }
}
