import { AggregateRoot } from '../../_shared/entity/aggregate-root';
import { DomainException } from '../../_shared/exception/domain.exception';
import { DateRange } from '../value-objects/date-range.vo';

export interface BookingProps {
  userId: string;
  venueId: string;
  dateRange: DateRange;
  guestsCount: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Booking extends AggregateRoot<string> {
  private props: BookingProps;

  private constructor(id: string, props: BookingProps) {
    super(id);
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public static create(id: string, props: BookingProps): Booking {
    if (!props.userId) {
      throw new DomainException('User ID is required');
    }
    if (!props.venueId) {
      throw new DomainException('Venue ID is required');
    }
    if (props.guestsCount <= 0) {
      throw new DomainException('Guests count must be greater than zero');
    }
    return new Booking(id, props);
  }

  public static restore(id: string, props: BookingProps): Booking {
    return new Booking(id, props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get venueId(): string {
    return this.props.venueId;
  }

  get dateRange(): DateRange {
    return this.props.dateRange;
  }

  get guestsCount(): number {
    return this.props.guestsCount;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public calculateTotalAmount(pricePerDay: number): void {
    if (pricePerDay < 0) {
      throw new DomainException('Price per day cannot be negative');
    }
    const days = this.dateRange.getDurationInDays();
    this.props.totalAmount = pricePerDay * days;
    this.props.updatedAt = new Date();
  }
}
