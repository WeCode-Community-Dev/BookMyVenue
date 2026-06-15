import { AggregateRoot } from '../../_shared/entity/aggregate-root';
import { DomainException } from '../../_shared/exception/domain.exception';

export type UserRole = 'ADMIN' | 'VENUE_OWNER' | 'USER';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';

export interface UserProps {
  email: string;
  password?: string | null;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  googleId?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<string> {
  private props: UserProps;

  private constructor(id: string, props: UserProps) {
    super(id);
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public static create(id: string, props: UserProps): User {
    if (!props.email || !props.email.includes('@')) {
      throw new DomainException('Invalid email address');
    }
    if (!props.firstName || props.firstName.trim().length === 0) {
      throw new DomainException('First name is required');
    }
    return new User(id, props);
  }

  public static restore(id: string, props: UserProps): User {
    return new User(id, props);
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string | null | undefined {
    return this.props.password;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string | null | undefined {
    return this.props.lastName;
  }

  get phone(): string | null | undefined {
    return this.props.phone;
  }

  get googleId(): string | null | undefined {
    return this.props.googleId;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public block(): void {
    if (this.props.status === 'DELETED') {
      throw new DomainException('Cannot block a deleted user');
    }
    this.props.status = 'BLOCKED';
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    if (this.props.status === 'DELETED') {
      throw new DomainException('Cannot activate a deleted user');
    }
    this.props.status = 'ACTIVE';
    this.props.updatedAt = new Date();
  }

  public delete(): void {
    this.props.status = 'DELETED';
    this.props.updatedAt = new Date();
  }

  public updateProfile(firstName: string, lastName?: string | null, phone?: string | null): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new DomainException('First name cannot be empty');
    }
    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.phone = phone;
    this.props.updatedAt = new Date();
  }
}
