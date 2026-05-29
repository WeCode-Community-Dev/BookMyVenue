import { Booking, BookingStatus } from "../../domain/entities/Booking.js";

import type {
  BookingRepository,
  BookingFilters,
} from "../../domain/repositories/BookingRepository.js";
import type { PrismaClient, Prisma } from "@prisma/client";

export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) return null;
    return this.toDomain(booking);
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
    });
    return bookings.map((booking) => this.toDomain(booking));
  }

  async findByVenueId(venueId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { venueId },
      orderBy: { startTime: "desc" },
    });
    return bookings.map((booking) => this.toDomain(booking));
  }

  async findAll(filters?: BookingFilters): Promise<Booking[]> {
    const where = this.buildWhereClause(filters);
    const bookings = await this.prisma.booking.findMany({
      where,
      orderBy: { startTime: "desc" },
    });
    return bookings.map((booking) => this.toDomain(booking));
  }

  async findOverlapping(venueId: string, startTime: Date, endTime: Date): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        venueId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        OR: [
          { AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }] },
          { AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }] },
          { AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }] },
        ],
      },
    });
    return bookings.map((booking) => this.toDomain(booking));
  }

  async save(booking: Booking): Promise<Booking> {
    const created = await this.prisma.booking.create({
      data: {
        id: booking.id,
        venueId: booking.venueId,
        userId: booking.userId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalPrice: booking.totalPrice,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
    });
    return this.toDomain(created);
  }

  async update(booking: Booking): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: booking.status,
        notes: booking.notes,
        updatedAt: booking.updatedAt,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({ where: { id } });
  }

  private buildWhereClause(filters?: BookingFilters): Prisma.BookingWhereInput {
    if (!filters) return {};

    const where: Prisma.BookingWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.venueId) where.venueId = filters.venueId;
    if (filters.status) where.status = filters.status;
    if (filters.startDate || filters.endDate) {
      where.startTime = {};
      if (filters.startDate) where.startTime.gte = filters.startDate;
      if (filters.endDate) where.startTime.lte = filters.endDate;
    }

    return where;
  }

  private toDomain(data: {
    id: string;
    venueId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Booking {
    return new Booking({
      id: data.id,
      venueId: data.venueId,
      userId: data.userId,
      startTime: data.startTime,
      endTime: data.endTime,
      totalPrice: data.totalPrice,
      status: data.status as BookingStatus,
      notes: data.notes ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
