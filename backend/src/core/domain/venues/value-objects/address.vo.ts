import { ValueObject } from '../../_shared/vo/value-object';
import { DomainException } from '../../_shared/exception/domain.exception';

export interface AddressProps {
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number | null;
  longitude?: number | null;
}

export class Address extends ValueObject<AddressProps> {
  private constructor(props: AddressProps) {
    super(props);
  }

  public static create(props: AddressProps): Address {
    if (!props.addressLine1 || props.addressLine1.trim().length === 0) {
      throw new DomainException('Address line 1 is required');
    }
    if (!props.city || props.city.trim().length === 0) {
      throw new DomainException('City is required');
    }
    if (!props.state || props.state.trim().length === 0) {
      throw new DomainException('State is required');
    }
    if (!props.country || props.country.trim().length === 0) {
      throw new DomainException('Country is required');
    }
    if (!props.postalCode || props.postalCode.trim().length === 0) {
      throw new DomainException('Postal code is required');
    }
    return new Address(props);
  }

  get addressLine1(): string {
    return this.props.addressLine1;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get country(): string {
    return this.props.country;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get latitude(): number | null | undefined {
    return this.props.latitude;
  }

  get longitude(): number | null | undefined {
    return this.props.longitude;
  }
}
