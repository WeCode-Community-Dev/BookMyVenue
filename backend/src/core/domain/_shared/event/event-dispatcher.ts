import type { DomainEvent } from './domain-event';

export interface EventDispatcher {
  dispatch(events: DomainEvent[]): Promise<void>;
}
