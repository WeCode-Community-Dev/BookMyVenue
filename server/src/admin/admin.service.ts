import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Venue, VenueStatus } from '../venues/entities/venue.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
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

  async updateVenueStatus(id: string, status: VenueStatus) {
    const venue = await this.venuesRepository.findOne({ where: { id } });
    if (!venue) throw new NotFoundException('Venue not found');
    venue.status = status;
    return this.venuesRepository.save(venue);
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
