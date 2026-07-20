import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus, PaymentStatus } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Venue, VenueDocument } from '../venues/schemas/venue.schema';
import { RescheduleRequestDto } from './dto/reschedule-request.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Venue.name) private readonly venueModel: Model<VenueDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const parts = createBookingDto.date.split(' ');
    const dateStr = parts[0];
    const timeStr = parts[1];

    if (timeStr) {
      const timeToMinutes = (t: string): number => {
        const p = t.split(':');
        if (p.length < 2) return 0;
        return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
      };

      const targetStart = timeToMinutes(timeStr);
      const targetEnd = targetStart + createBookingDto.hours * 60;

      // Check conflict
      const dateRegex = new RegExp(`^${dateStr}`);
      const existing = await this.bookingModel.find({
        venueId: createBookingDto.venueId,
        date: { $regex: dateRegex }
      }).exec();

      const conflict = existing.some(b => {
        if (
          b.status === BookingStatus.CANCELLED || 
          b.status === BookingStatus.CANCELLED_BY_CUSTOMER ||
          b.status === BookingStatus.CANCELLED_BY_OWNER ||
          b.status === BookingStatus.REJECTED || 
          b.status === BookingStatus.EXPIRED
        ) {
          return false;
        }
        if (b.status === BookingStatus.LOCKED && b.lockedUntil && b.lockedUntil.getTime() <= Date.now()) {
          return false;
        }

        const bParts = b.date.split(' ');
        const bTimeStr = bParts[1];
        if (!bTimeStr) return true;

        const bStart = timeToMinutes(bTimeStr);
        const bEnd = bStart + b.hours * 60;

        return targetStart < bEnd && bStart < targetEnd;
      });

      if (conflict) {
        throw new ConflictException('This time slot is already booked or locked.');
      }
    }

    const lockedUntil = createBookingDto.status === BookingStatus.LOCKED 
      ? new Date(Date.now() + 10 * 60 * 1000) 
      : undefined;

    const createdBooking = new this.bookingModel({
      ...createBookingDto,
      lockedUntil,
      paymentStatus: createBookingDto.status === BookingStatus.LOCKED 
        ? PaymentStatus.PENDING 
        : (createBookingDto.status === BookingStatus.CONFIRMED ? PaymentStatus.PAID : PaymentStatus.PENDING)
    });
    return createdBooking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().populate('venueId').populate('userId').exec();
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingModel.find({ userId }).populate('venueId').exec();
  }

  async findByOwner(ownerId: string): Promise<Booking[]> {
    const venues = await this.venueModel.find({ ownerId }).select('_id').exec();
    const venueIds = venues.map((v) => v._id.toString());
    return this.bookingModel
      .find({ venueId: { $in: venueIds } })
      .populate('venueId')
      .populate('userId')
      .exec();
  }

  async findByVenue(venueId: string): Promise<Booking[]> {
    return this.bookingModel.find({ venueId }).populate('userId').exec();
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).populate('venueId').populate('userId').exec();
  }

  async updateStatus(
    id: string,
    status: string,
    user?: any,
    cancellationReason?: string,
    totalPrice?: number
  ): Promise<Booking | null> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const targetStatus = status.toUpperCase();

    // Prevent any transition if status is COMPLETED or NO_SHOW
    if (booking.status === BookingStatus.COMPLETED) {
      throw new ConflictException('Cannot transition from COMPLETED status.');
    }
    if (booking.status === BookingStatus.NO_SHOW) {
      throw new ConflictException('Cannot transition from NO_SHOW status.');
    }

    // If no change, return booking
    if (booking.status === targetStatus && (totalPrice === undefined || totalPrice === booking.totalPrice)) {
      return booking;
    }

    const updateData: any = { status: targetStatus };
    if (totalPrice !== undefined) {
      updateData.totalPrice = totalPrice;
    }

    // If user is provided, enforce access control and transition validations
    if (user) {
      const isCustomer = user.id === booking.userId.toString();
      
      const venue = await this.venueModel.findById(booking.venueId).exec();
      const isOwner = venue && venue?.ownerId?.toString() === user.id;

      const isAdmin = user.role === 'Admin';

      // 1. Customer actions
      if (isCustomer && !isAdmin && !isOwner) {
        if (targetStatus !== BookingStatus.CANCELLED_BY_CUSTOMER && targetStatus !== BookingStatus.CANCELLED) {
          throw new BadRequestException(`Customers are not authorized to transition booking to ${targetStatus}.`);
        }
        if (
          booking.status !== BookingStatus.REQUESTED &&
          booking.status !== BookingStatus.PAYMENT_PENDING &&
          booking.status !== BookingStatus.LOCKED &&
          booking.status !== BookingStatus.CONFIRMED
        ) {
          throw new BadRequestException('Customers can only cancel bookings that are REQUESTED, PAYMENT_PENDING, LOCKED, or CONFIRMED.');
        }

        if (targetStatus === BookingStatus.CANCELLED_BY_CUSTOMER || targetStatus === BookingStatus.CANCELLED) {
          updateData.cancelledAt = new Date();
          updateData.cancelledBy = user.id;
          updateData.cancellationReason = cancellationReason || '';

          if (booking.paymentStatus === PaymentStatus.PAID) {
            updateData.refundStatus = 'PENDING';
            updateData.refundRequestedAt = new Date();
            updateData.refundAmount = booking.totalPrice;
          }
        }
      }

      // 2. Owner actions
      else if (isOwner && !isAdmin) {
        if (booking.status === BookingStatus.REQUESTED) {
          if (targetStatus !== BookingStatus.PAYMENT_PENDING && targetStatus !== BookingStatus.REJECTED) {
            throw new BadRequestException('From REQUESTED status, owner can only approve (PAYMENT_PENDING) or reject (REJECTED).');
          }
        } else if (booking.status === BookingStatus.PAYMENT_PENDING) {
          if (targetStatus !== BookingStatus.CANCELLED_BY_OWNER) {
            throw new BadRequestException('From PAYMENT_PENDING status, owner can only cancel the booking.');
          }
        } else if (booking.status === BookingStatus.CONFIRMED) {
          if (
            targetStatus !== BookingStatus.COMPLETED &&
            targetStatus !== BookingStatus.NO_SHOW &&
            targetStatus !== BookingStatus.CANCELLED_BY_OWNER
          ) {
            throw new BadRequestException('From CONFIRMED status, owner can only mark COMPLETED, NO_SHOW, or CANCELLED_BY_OWNER.');
          }
        } else {
          throw new BadRequestException(`Owner cannot transition booking from current status ${booking.status}.`);
        }

        if (targetStatus === BookingStatus.CANCELLED_BY_OWNER) {
          if (!cancellationReason) {
            throw new BadRequestException('Cancellation reason is required when owner cancels booking.');
          }
          updateData.cancelledAt = new Date();
          updateData.cancelledBy = user.id;
          updateData.cancellationReason = cancellationReason;

          // If booking is paid, automatically trigger refund process
          if (booking.paymentStatus === PaymentStatus.PAID) {
            // updateData.refundStatus = RefundStatus.PENDING;
            updateData.refundRequestedAt = new Date();
            updateData.refundAmount = booking.totalPrice;
          }
        }
      }

      // 3. Admin actions
      else if (isAdmin) {
        if (targetStatus === BookingStatus.CANCELLED_BY_OWNER) {
          updateData.cancelledAt = new Date();
          updateData.cancelledBy = user.id;
          updateData.cancellationReason = cancellationReason || 'Cancelled by Admin';

          if (booking.paymentStatus === PaymentStatus.PAID) {
            // updateData.refundStatus = RefundStatus.PENDING;
            updateData.refundRequestedAt = new Date();
            updateData.refundAmount = booking.totalPrice;
          }
        } else if (targetStatus === BookingStatus.CANCELLED_BY_CUSTOMER) {
          updateData.cancelledAt = new Date();
          updateData.cancelledBy = user.id;
        }
      } else {
        throw new BadRequestException('You are not authorized to modify this booking.');
      }
    } else {
      // Bypassed user checks (e.g. system locks expiry)
      if (targetStatus === BookingStatus.CANCELLED_BY_OWNER) {
        updateData.cancelledAt = new Date();
        updateData.cancelledBy = 'system';
        updateData.cancellationReason = cancellationReason || 'Cancelled by System';

        if (booking.paymentStatus === PaymentStatus.PAID) {
          // updateData.refundStatus = RefundStatus.PENDING;
          updateData.refundRequestedAt = new Date();
          updateData.refundAmount = booking.totalPrice;
        }
      } else if (targetStatus === BookingStatus.CANCELLED_BY_CUSTOMER) {
        updateData.cancelledAt = new Date();
        updateData.cancelledBy = 'system';
      }
    }

    // Set payment status updates based on the target status transitions
    if (targetStatus === BookingStatus.CONFIRMED) {
      updateData.paymentStatus = PaymentStatus.PAID;
      updateData.$unset = { lockedUntil: 1 };
    } else if (
      targetStatus === BookingStatus.REJECTED || 
      targetStatus === BookingStatus.CANCELLED || 
      targetStatus === BookingStatus.EXPIRED ||
      targetStatus === BookingStatus.CANCELLED_BY_CUSTOMER ||
      targetStatus === BookingStatus.CANCELLED_BY_OWNER
    ) {
      updateData.$unset = { lockedUntil: 1 };
    }

    return this.bookingModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async confirmPayment(bookingId: string): Promise<Booking | null> {
    const booking = await this.bookingModel.findById(bookingId).exec();
    if (!booking) {
      return null;
    }

    if (booking.status === BookingStatus.LOCKED && booking.lockedUntil && booking.lockedUntil.getTime() <= Date.now()) {
      await this.bookingModel.findByIdAndUpdate(bookingId, {
        status: BookingStatus.EXPIRED,
        paymentStatus: PaymentStatus.FAILED,
        $unset: { lockedUntil: 1 }
      }).exec();
      throw new ConflictException('Booking lock has expired.');
    }

    if (booking.status !== BookingStatus.LOCKED && booking.status !== BookingStatus.PAYMENT_PENDING) {
      throw new ConflictException(`Cannot confirm payment for booking in ${booking.status} status.`);
    }

    return this.bookingModel.findByIdAndUpdate(
      bookingId,
      {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        $unset: { lockedUntil: 1 }
      },
      { new: true }
    ).exec();
  }

  async reschedule(id: string, dto: RescheduleRequestDto, user: any): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.userId.toString() !== user.id) {
      throw new BadRequestException('Only the customer who made the booking can request a reschedule.');
    }

    const invalidRescheduleStatuses = [
      BookingStatus.COMPLETED,
      BookingStatus.NO_SHOW,
      BookingStatus.REJECTED,
      BookingStatus.EXPIRED,
      BookingStatus.CANCELLED_BY_CUSTOMER,
      BookingStatus.CANCELLED_BY_OWNER,
      BookingStatus.CANCELLED,
    ];
    if (invalidRescheduleStatuses.includes(booking.status as BookingStatus)) {
      throw new BadRequestException('Booking cannot be rescheduled from its current status.');
    }

    if (booking.rescheduleStatus === 'PENDING') {
      throw new BadRequestException('Another reschedule request is already pending for this booking.');
    }

    booking.rescheduleStatus = 'PENDING';
    booking.pendingReschedule = {
      requestedDate: dto.requestedDate,
      requestedHours: dto.requestedHours,
      requestedSlot: dto.requestedSlot,
      requestedAt: new Date(),
      reason: dto.reason,
    };

    const saved = await booking.save();
    // Notification Integration Point: Customer requested reschedule
    console.log(`Notification: Customer ${user.id} requested reschedule for booking ${id}`);
    return saved;
  }

  async approveReschedule(id: string, user: any): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const venue = await this.venueModel.findById(booking.venueId).exec();
    if (!venue || venue.ownerId.toString() !== user.id) {
      throw new BadRequestException('Only the venue owner can approve the reschedule request.');
    }

    if (booking.rescheduleStatus !== 'PENDING' || !booking.pendingReschedule) {
      throw new BadRequestException('No pending reschedule request found for this booking.');
    }

    const pending = booking.pendingReschedule;
    const parts = pending.requestedDate.split(' ');
    const dateStr = parts[0];
    const timeStr = parts[1];

    if (timeStr) {
      const timeToMinutes = (t: string): number => {
        const p = t.split(':');
        if (p.length < 2) return 0;
        return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
      };

      const targetStart = timeToMinutes(timeStr);
      const targetEnd = targetStart + pending.requestedHours * 60;

      // Check conflict on requested date (excluding self)
      const dateRegex = new RegExp(`^${dateStr}`);
      const existing = await this.bookingModel.find({
        _id: { $ne: booking._id },
        venueId: booking.venueId,
        date: { $regex: dateRegex }
      }).exec();

      const conflict = existing.some(b => {
        if (
          b.status === BookingStatus.CANCELLED || 
          b.status === BookingStatus.CANCELLED_BY_CUSTOMER ||
          b.status === BookingStatus.CANCELLED_BY_OWNER ||
          b.status === BookingStatus.REJECTED || 
          b.status === BookingStatus.EXPIRED
        ) {
          return false;
        }
        if (b.status === BookingStatus.LOCKED && b.lockedUntil && b.lockedUntil.getTime() <= Date.now()) {
          return false;
        }

        const bParts = b.date.split(' ');
        const bTimeStr = bParts[1];
        if (!bTimeStr) return true;

        const bStart = timeToMinutes(bTimeStr);
        const bEnd = bStart + b.hours * 60;

        return targetStart < bEnd && bStart < targetEnd;
      });

      if (conflict) {
        throw new ConflictException('The requested reschedule time slot conflicts with an existing booking.');
      }
    }

    // Update date, hours, slot, and calculate price
    booking.date = pending.requestedDate;
    booking.hours = pending.requestedHours;
    if (pending.requestedSlot && pending.requestedSlot.price) {
      booking.totalPrice = pending.requestedSlot.price;
    } else {
      booking.totalPrice = pending.requestedHours * (venue.hourlyBookingConfiguration?.pricePerHour || 0);
    }

    booking.rescheduleStatus = 'APPROVED';
    booking.pendingReschedule = undefined; // Clears subdocument

    const saved = await booking.save();
    // Notification Integration Point: Owner approved reschedule
    console.log(`Notification: Owner ${user.id} approved reschedule for booking ${id}`);
    return saved;
  }

  async rejectReschedule(id: string, user: any): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const venue = await this.venueModel.findById(booking.venueId).exec();
    if (!venue || venue.ownerId.toString() !== user.id) {
      throw new BadRequestException('Only the venue owner can reject the reschedule request.');
    }

    if (booking.rescheduleStatus !== 'PENDING') {
      throw new BadRequestException('No pending reschedule request found for this booking.');
    }

    booking.rescheduleStatus = 'REJECTED';
    booking.pendingReschedule = undefined; // Clears subdocument

    const saved = await booking.save();
    // Notification Integration Point: Owner rejected reschedule
    console.log(`Notification: Owner ${user.id} rejected reschedule for booking ${id}`);
    return saved;
  }
}
