import { AvailableEventDto } from '../dtos/available-event.dto';
import { GetAvailableEventsQuery } from '../queries/get-available-events.query';

export const EVENT_QUERY_REPOSITORY = 'EVENT_QUERY_REPOSITORY';

export interface IEventQueryRepository {
  getAvailableEvents(query: GetAvailableEventsQuery): Promise<AvailableEventDto[]>;
}
