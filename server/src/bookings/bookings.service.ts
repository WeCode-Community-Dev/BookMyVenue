import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { BookingLock, LockStatus } from '../booking-locks/entities/booking-lock.entity';
import { Venue } from '../venues/entities/venue.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User, UserRole } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(BookingLock)
    private locksRepository: Repository<BookingLock>,
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string) {
    const { venueId, bookingDate, startTime, endTime, guestCount, lockId } = createBookingDto;

    const venue = await this.venuesRepository.findOne({ where: { id: venueId } });
    if (!venue) throw new NotFoundException('Venue not found');

    const overlap = await this.checkOverlap(venueId, bookingDate, startTime, endTime);
    if (overlap) throw new ConflictException('This time slot is already booked');

    if (lockId) {
      const lock = await this.locksRepository.findOne({
        where: { id: lockId, lockedByUserId: userId, status: LockStatus.ACTIVE },
      });
      if (!lock) throw new BadRequestException('Invalid or expired booking lock');
      lock.status = LockStatus.USED;
      await this.locksRepository.save(lock);
    }

    const startHour = this.parseTime(startTime);
    const endHour = this.parseTime(endTime);
    const hours = endHour - startHour;
    const totalAmount = hours * Number(venue.pricePerHour);

    const bookingCode = 'BMV-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const booking = this.bookingsRepository.create({
      bookingCode,
      userId,
      venueId,
      bookingDate,
      startTime,
      endTime,
      guestCount: guestCount || 1,
      totalAmount,
      bookingStatus: BookingStatus.PENDING,
    });

    return this.bookingsRepository.save(booking);
  }

  async findUserBookings(userId: string, status?: BookingStatus, page = 1, limit = 10) {
    const where: any = { userId };
    if (status) where.bookingStatus = status;

    const [bookings, total] = await this.bookingsRepository.findAndCount({
      where,
      relations: { venue: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { bookings, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findVenueBookings(venueId: string, ownerId: string, page = 1, limit = 10) {
    const venue = await this.venuesRepository.findOne({ where: { id: venueId } });
    if (!venue || venue.ownerId !== ownerId) throw new ForbiddenException('Access denied');

    const [bookings, total] = await this.bookingsRepository.findAndCount({
      where: { venueId },
      relations: { user: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { bookingDate: 'DESC' },
    });

    return { bookings, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOwnerBookings(ownerId: string, status?: BookingStatus, page = 1, limit = 10) {
    const qb = this.bookingsRepository.createQueryBuilder('booking')
      .innerJoinAndSelect('booking.venue', 'venue')
      .innerJoinAndSelect('booking.user', 'user')
      .where('venue.ownerId = :ownerId', { ownerId });

    if (status) qb.andWhere('booking.bookingStatus = :status', { status });

    qb.orderBy('booking.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [bookings, total] = await qb.getManyAndCount();
    return { bookings, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id: string, bookingStatus: BookingStatus, user: User) {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: { venue: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (user.role === UserRole.VENUE_OWNER) {
      if (booking.venue.ownerId !== user.id) throw new ForbiddenException('Access denied');
    } else if (user.role === UserRole.USER) {
      if (booking.userId !== user.id) throw new ForbiddenException('Access denied');
      if (bookingStatus !== BookingStatus.CANCELLED) throw new ForbiddenException('Users can only cancel bookings');
    }

    booking.bookingStatus = bookingStatus;
    return this.bookingsRepository.save(booking);
  }

  async findOne(id: string) {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: { venue: true, user: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findAllAdmin(page = 1, limit = 20, status?: BookingStatus) {
    const where = status ? { bookingStatus: status } : {};
    const [bookings, total] = await this.bookingsRepository.findAndCount({
      where,
      relations: { venue: true, user: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { bookings, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getStats() {
    const total = await this.bookingsRepository.count();
    const pending = await this.bookingsRepository.count({ where: { bookingStatus: BookingStatus.PENDING } });
    const confirmed = await this.bookingsRepository.count({ where: { bookingStatus: BookingStatus.CONFIRMED } });
    const cancelled = await this.bookingsRepository.count({ where: { bookingStatus: BookingStatus.CANCELLED } });
    const completed = await this.bookingsRepository.count({ where: { bookingStatus: BookingStatus.COMPLETED } });

    const revenueResult = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount)', 'totalRevenue')
      .where('booking.bookingStatus IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
      })
      .getRawOne();

    return {
      total, pending, confirmed, cancelled, completed,
      totalRevenue: parseFloat(revenueResult?.totalRevenue || '0'),
    };
  }

  async checkAvailability(venueId: string, bookingDate: string) {
    const bookings = await this.bookingsRepository.find({
      where: { venueId, bookingDate, bookingStatus: BookingStatus.CONFIRMED },
      select: { startTime: true, endTime: true },
    });
    return { bookedSlots: bookings, date: bookingDate };
  }

  private async checkOverlap(venueId: string, bookingDate: string, startTime: string, endTime: string, excludeId?: string): Promise<boolean> {
    const qb = this.bookingsRepository.createQueryBuilder('booking')
      .where('booking.venueId = :venueId', { venueId })
      .andWhere('booking.bookingDate = :bookingDate', { bookingDate })
      .andWhere('booking.bookingStatus IN (:...statuses)', { statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED] })
      .andWhere('(booking.startTime < :endTime AND booking.endTime > :startTime)', { startTime, endTime });

    if (excludeId) qb.andWhere('booking.id != :excludeId', { excludeId });
    const count = await qb.getCount();
    return count > 0;
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }
}
