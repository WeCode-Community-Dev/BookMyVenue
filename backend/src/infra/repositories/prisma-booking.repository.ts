import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { Booking } from '../../core/domain/bookings/entities/booking.entity';
import { DateRange } from '../../core/domain/bookings/value-objects/date-range.vo';
import type { IBookingRepository } from '../../core/domain/bookings/repositories/booking-repository.interface';

@Injectable()
export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(dbBooking: any): Booking {
    const dateRange = DateRange.create(dbBooking.booking_start, dbBooking.booking_end);
    return Booking.restore(dbBooking.id, {
      userId: dbBooking.user_id,
      venueId: dbBooking.venue_id,
      dateRange,
      guestsCount: dbBooking.guests_count,
      totalAmount: Number(dbBooking.total_amount),
      createdAt: dbBooking.created_at,
      updatedAt: dbBooking.updated_at,
    });
  }

  async findById(id: string): Promise<Booking | null> {
    const dbBooking = await this.prisma.bookings.findUnique({
      where: { id },
    });
    if (!dbBooking) return null;
    return this.mapToDomain(dbBooking);
  }

  async findByVenueId(venueId: string): Promise<Booking[]> {
    const dbBookings = await this.prisma.bookings.findMany({
      where: { venue_id: venueId },
      orderBy: { booking_start: 'asc' },
    });
    return dbBookings.map((b) => this.mapToDomain(b));
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const dbBookings = await this.prisma.bookings.findMany({
      where: { user_id: userId },
      orderBy: { booking_start: 'asc' },
    });
    return dbBookings.map((b) => this.mapToDomain(b));
  }

  async checkAvailability(venueId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const count = await this.prisma.bookings.count({
      where: {
        venue_id: venueId,
        booking_start: {
          lt: endDate,
        },
        booking_end: {
          gt: startDate,
        },
      },
    });
    return count === 0;
  }

  async save(booking: Booking): Promise<void> {
    const data = {
      user_id: booking.userId,
      venue_id: booking.venueId,
      booking_start: booking.dateRange.startDate,
      booking_end: booking.dateRange.endDate,
      guests_count: booking.guestsCount,
      total_amount: booking.totalAmount as any,
      updated_at: booking.updatedAt,
    };

    await this.prisma.bookings.upsert({
      where: { id: booking.id },
      update: data,
      create: {
        id: booking.id,
        ...data,
        created_at: booking.createdAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.bookings.delete({
      where: { id },
    });
  }
}
