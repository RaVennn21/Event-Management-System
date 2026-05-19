import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetEventDetailsQuery } from './get-event-details.query';
import { EventDetailDto } from '../dtos/event-detail.dto';
import { EVENT_QUERY_REPOSITORY } from '../interfaces/event-query.repository.interface';
import type { IEventQueryRepository } from '../interfaces/event-query.repository.interface';

@QueryHandler(GetEventDetailsQuery)
export class GetEventDetailsHandler implements IQueryHandler<GetEventDetailsQuery, EventDetailDto> {
  constructor(
    @Inject(EVENT_QUERY_REPOSITORY)
    private readonly eventQueryRepository: IEventQueryRepository,
  ) {}

  async execute(query: GetEventDetailsQuery): Promise<EventDetailDto> {
    return this.eventQueryRepository.getEventDetails(query.eventId);
  }
}
