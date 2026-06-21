import { AggregateRoot } from '../../_shared/entity/aggregate-root';
import { DomainException } from '../../_shared/exception/domain.exception';
import { Address } from '../value-objects/address.vo';

export type VenueStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface VenueProps {
  ownerId: string;
  title: string;
  description: string;
  venueType: string;
  address: Address;
  capacity: number;
  pricePerDay: number;
  status: VenueStatus;
  createdAt?: Date;
  updatedAt?: Date;
  amenities: string[]
  images: {
    id: string,
    url: string,
    createdAt: Date
  }[]
}

export class Venue extends AggregateRoot<string> {
  private props: VenueProps;

  private constructor(id: string, props: VenueProps) {
    super(id);
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public static create(id: string, props: VenueProps): Venue {
    if (!props.ownerId) {
      throw new DomainException('Owner ID is required');
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new DomainException('Title is required');
    }
    if (!props.description || props.description.trim().length === 0) {
      throw new DomainException('Description is required');
    }
    if (!props.venueType || props.venueType.trim().length === 0) {
      throw new DomainException('Venue type is required');
    }
    if (props.capacity <= 0) {
      throw new DomainException('Capacity must be greater than zero');
    }
    if (props.pricePerDay < 0) {
      throw new DomainException('Price per day cannot be negative');
    }
    return new Venue(id, props);
  }

  public static restore(id: string, props: VenueProps): Venue {
    return new Venue(id, props);
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get venueType(): string {
    return this.props.venueType;
  }

  get address(): Address {
    return this.props.address;
  }

  get capacity(): number {
    return this.props.capacity;
  }

  get pricePerDay(): number {
    return this.props.pricePerDay;
  }

  get status(): VenueStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get amenities(): string[] {
    return this.props.amenities;
  }

  get images(): VenueProps['images'] {
    return this.props.images;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public approve(): void {
    if (this.props.status !== 'PENDING') {
      throw new DomainException('Only pending venues can be approved');
    }
    this.props.status = 'APPROVED';
    this.props.updatedAt = new Date();
  }

  public reject(): void {
    if (this.props.status !== 'PENDING') {
      throw new DomainException('Only pending venues can be rejected');
    }
    this.props.status = 'REJECTED';
    this.props.updatedAt = new Date();
  }

  public suspend(): void {
    if (this.props.status !== 'APPROVED') {
      throw new DomainException('Only approved venues can be suspended');
    }
    this.props.status = 'SUSPENDED';
    this.props.updatedAt = new Date();
  }

  public updateDetails(
    title: string,
    description: string,
    venueType: string,
    address: Address,
    capacity: number,
    pricePerDay: number,
    amenities: string[]
  ): void {
    if (!title || title.trim().length === 0) {
      throw new DomainException('Title cannot be empty');
    }
    if (!description || description.trim().length === 0) {
      throw new DomainException('Description cannot be empty');
    }
    if (capacity <= 0) {
      throw new DomainException('Capacity must be greater than zero');
    }
    if (pricePerDay < 0) {
      throw new DomainException('Price per day cannot be negative');
    }

    this.props.title = title;
    this.props.description = description;
    this.props.venueType = venueType;
    this.props.address = address;
    this.props.capacity = capacity;
    this.props.pricePerDay = pricePerDay;
    this.props.amenities = amenities
    this.props.updatedAt = new Date();
  }
}
