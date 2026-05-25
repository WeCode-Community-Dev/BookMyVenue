import { v4 as uuidv4 } from "uuid";

export interface VenueProps {
  id?: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  images: string[];
  ownerId: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Venue {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _address: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;
  private _capacity: number;
  private _pricePerHour: number;
  private _amenities: string[];
  private _images: string[];
  private readonly _ownerId: string;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: VenueProps) {
    this._id = props.id ?? uuidv4();
    this._name = props.name;
    this._description = props.description;
    this._address = props.address;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;
    this._capacity = props.capacity;
    this._pricePerHour = props.pricePerHour;
    this._amenities = props.amenities;
    this._images = props.images;
    this._ownerId = props.ownerId;
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get address(): string {
    return this._address;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get fullAddress(): string {
    return `${this._address}, ${this._city}, ${this._state} ${this._zipCode}`;
  }

  get capacity(): number {
    return this._capacity;
  }

  get pricePerHour(): number {
    return this._pricePerHour;
  }

  get amenities(): string[] {
    return [...this._amenities];
  }

  get images(): string[] {
    return [...this._images];
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  update(props: Partial<Omit<VenueProps, "id" | "ownerId" | "createdAt">>): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.description !== undefined) this._description = props.description;
    if (props.address !== undefined) this._address = props.address;
    if (props.city !== undefined) this._city = props.city;
    if (props.state !== undefined) this._state = props.state;
    if (props.zipCode !== undefined) this._zipCode = props.zipCode;
    if (props.capacity !== undefined) this._capacity = props.capacity;
    if (props.pricePerHour !== undefined) this._pricePerHour = props.pricePerHour;
    if (props.amenities !== undefined) this._amenities = props.amenities;
    if (props.images !== undefined) this._images = props.images;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      address: this._address,
      city: this._city,
      state: this._state,
      zipCode: this._zipCode,
      fullAddress: this.fullAddress,
      capacity: this._capacity,
      pricePerHour: this._pricePerHour,
      amenities: this._amenities,
      images: this._images,
      ownerId: this._ownerId,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
