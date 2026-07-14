import type { DomainEvent } from '../event/domain-event';
import { Entity } from './entity';

export abstract class AggregateRoot<TId> extends Entity<TId> {
  private readonly domainEvents: DomainEvent[] = [];

  addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;

    return events;
  }
}
