import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Venue, VenueStatus } from '../venues/entities/venue.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private eventEmitter: EventEmitter2,
  ) {}

  // User Management
  async getUsers(page = 1, limit = 20, role?: UserRole, status?: UserStatus, search?: string) {
    const qb = this.usersRepository.createQueryBuilder('user');

    if (role) qb.andWhere('user.role = :role', { role });
    if (status) qb.andWhere('user.status = :status', { status });
    if (search) {
      qb.andWhere(
        '(LOWER(user.name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('user.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [users, total] = await qb.getManyAndCount();
    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateUserStatus(id: string, status: UserStatus, reason?: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.status = status;
    if (reason !== undefined) {
      user.blockReason = reason;
    }
    return this.usersRepository.save(user);
  }

  // Venue Owner Management
  async getVenueOwners(page = 1, limit = 20, search?: string) {
    const qb = this.usersRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.VENUE_OWNER })
      .loadRelationIdAndMap('user.venueIds', 'user.venues');

    if (search) {
      qb.andWhere(
        '(LOWER(user.name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('user.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [owners, total] = await qb.getManyAndCount();
    return { owners, total, page, totalPages: Math.ceil(total / limit) };
  }

  // Venue Management
  async getVenues(page = 1, limit = 20, status?: VenueStatus) {
    const where = status ? { status } : {};
    const [venues, total] = await this.venuesRepository.findAndCount({
      where,
      relations: { owner: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { venues, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateVenueStatus(id: string, status: VenueStatus, reason?: string) {
    const venue = await this.venuesRepository.findOne({ where: { id }, relations: { owner: true } });
    if (!venue) throw new NotFoundException('Venue not found');

    if (status === VenueStatus.SUSPENDED) {
      // Calculate today's local date string (YYYY-MM-DD)
      const today = new Date();
      const offset = today.getTimezoneOffset();
      const localToday = new Date(today.getTime() - offset * 60 * 1000);
      const todayStr = localToday.toISOString().split('T')[0];

      // Block suspension if there are any active (pending/confirmed) bookings today or in the future
      const upcomingBookingsCount = await this.bookingsRepository.count({
        where: {
          venueId: id,
          bookingStatus: In([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
          bookingDate: MoreThanOrEqual(todayStr) as any,
        },
      });

      if (upcomingBookingsCount > 0) {
        throw new BadRequestException('Cannot suspend a venue with active or upcoming bookings.');
      }

      if (reason !== undefined) {
        venue.suspensionReason = reason;
      }
    } else if (status === VenueStatus.APPROVED) {
      // If listing is restored / approved, clear previous suspension reasons
      venue.suspensionReason = null;
    }

    venue.status = status;
    const savedVenue = await this.venuesRepository.save(venue);

    // Emit event asynchronously to trigger Resend emails to the Host
    if (status === VenueStatus.SUSPENDED) {
      this.eventEmitter.emit('venue.suspended', { venueId: savedVenue.id });
    } else if (status === VenueStatus.APPROVED) {
      this.eventEmitter.emit('venue.activated', { venueId: savedVenue.id });
    }

    return savedVenue;
  }

  // Booking Management
  async getBookings(page = 1, limit = 20, status?: BookingStatus) {
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

  async updateBookingStatus(id: string, bookingStatus: BookingStatus) {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    booking.bookingStatus = bookingStatus;
    return this.bookingsRepository.save(booking);
  }

  // Analytics
  async getAnalytics() {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({ where: { status: UserStatus.ACTIVE } });
    const totalVenueOwners = await this.usersRepository.count({ where: { role: UserRole.VENUE_OWNER } });
    const totalVenues = await this.venuesRepository.count();
    const approvedVenues = await this.venuesRepository.count({ where: { status: VenueStatus.APPROVED } });
    const pendingVenues = await this.venuesRepository.count({ where: { status: VenueStatus.PENDING } });
    const totalBookings = await this.bookingsRepository.count();
    const confirmedBookings = await this.bookingsRepository.count({ where: { bookingStatus: BookingStatus.CONFIRMED } });
    const pendingBookings = await this.bookingsRepository.count({ where: { bookingStatus: BookingStatus.PENDING } });

    const revenueResult = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount)', 'totalRevenue')
      .where('booking.bookingStatus IN (:...statuses)', {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
      })
      .getRawOne();

    const popularVenues = await this.bookingsRepository
      .createQueryBuilder('booking')
      .select('booking.venueId', 'venueId')
      .addSelect('COUNT(booking.id)', 'bookingCount')
      .innerJoin('booking.venue', 'venue')
      .addSelect('venue.venueName', 'venueName')
      .groupBy('booking.venueId')
      .addGroupBy('venue.venueName')
      .orderBy('"bookingCount"', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      users: { total: totalUsers, active: activeUsers, venueOwners: totalVenueOwners },
      venues: { total: totalVenues, approved: approvedVenues, pending: pendingVenues },
      bookings: { total: totalBookings, confirmed: confirmedBookings, pending: pendingBookings },
      totalRevenue: parseFloat(revenueResult?.totalRevenue || '0'),
      popularVenues,
    };
  }
}
