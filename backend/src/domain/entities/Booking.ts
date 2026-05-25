import { v4 as uuidv4 } from "uuid";

export interface BookingProps {
  id?: string;
  venueId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status?: BookingStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export class Booking {
  private readonly _id: string;
  private readonly _venueId: string;
  private readonly _userId: string;
  private readonly _startTime: Date;
  private readonly _endTime: Date;
  private readonly _totalPrice: number;
  private _status: BookingStatus;
  private _notes: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: BookingProps) {
    this.validateBookingTimes(props.startTime, props.endTime);

    this._id = props.id ?? uuidv4();
    this._venueId = props.venueId;
    this._userId = props.userId;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._totalPrice = props.totalPrice;
    this._status = props.status ?? BookingStatus.PENDING;
    this._notes = props.notes ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validateBookingTimes(startTime: Date, endTime: Date): void {
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }
    if (startTime < new Date()) {
      throw new Error("Cannot book in the past");
    }
  }

  get id(): string {
    return this._id;
  }

  get venueId(): string {
    return this._venueId;
  }

  get userId(): string {
    return this._userId;
  }

  get startTime(): Date {
    return this._startTime;
  }

  get endTime(): Date {
    return this._endTime;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get status(): BookingStatus {
    return this._status;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get durationInHours(): number {
    return (this._endTime.getTime() - this._startTime.getTime()) / (1000 * 60 * 60);
  }

  confirm(): void {
    if (this._status !== BookingStatus.PENDING) {
      throw new Error("Only pending bookings can be confirmed");
    }
    this._status = BookingStatus.CONFIRMED;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (this._status === BookingStatus.COMPLETED) {
      throw new Error("Cannot cancel a completed booking");
    }
    if (this._status === BookingStatus.CANCELLED) {
      throw new Error("Booking is already cancelled");
    }
    this._status = BookingStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  complete(): void {
    if (this._status !== BookingStatus.CONFIRMED) {
      throw new Error("Only confirmed bookings can be completed");
    }
    this._status = BookingStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  addNotes(notes: string): void {
    this._notes = notes;
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      venueId: this._venueId,
      userId: this._userId,
      startTime: this._startTime,
      endTime: this._endTime,
      totalPrice: this._totalPrice,
      status: this._status,
      notes: this._notes,
      durationInHours: this.durationInHours,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
