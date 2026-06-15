import { ValueObject } from '../../_shared/vo/value-object';
import { DomainException } from '../../_shared/exception/domain.exception';

export interface DateRangeProps {
  startDate: Date;
  endDate: Date;
}

export class DateRange extends ValueObject<DateRangeProps> {
  private constructor(props: DateRangeProps) {
    super(props);
  }

  public static create(startDate: Date, endDate: Date): DateRange {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new DomainException('Invalid start or end date');
    }
    if (startDate >= endDate) {
      throw new DomainException('Start date must be before end date');
    }
    // Simple verification - let's allow bookings on the same day if time is correct, but typically we want in the future
    return new DateRange({ startDate, endDate });
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }

  public overlaps(other: DateRange): boolean {
    return this.startDate < other.endDate && this.endDate > other.startDate;
  }

  public getDurationInDays(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  }
}
