import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue, VenueStatus, VenueType } from './entities/venue.entity';
import { VenueBlockedDate } from './entities/venue-blocked-date.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
    @InjectRepository(VenueBlockedDate)
    private blockedDatesRepository: Repository<VenueBlockedDate>,
  ) {}

  async create(createVenueDto: CreateVenueDto, ownerId: string) {
    const venue = this.venuesRepository.create({
      ...createVenueDto,
      ownerId,
      status: VenueStatus.PENDING,
    });

    return this.venuesRepository.save(venue);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    venueType?: VenueType;
    minCapacity?: number;
    maxCapacity?: number;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    status?: VenueStatus;
    search?: string;
  }) {
    const {
      page = 1,
      limit = 12,
      venueType,
      minCapacity,
      maxCapacity,
      minPrice,
      maxPrice,
      minRating,
      status = VenueStatus.APPROVED,
      search,
    } = query;

    const qb = this.venuesRepository.createQueryBuilder('venue');

    qb.where('venue.status = :status', { status });

    if (venueType) {
      qb.andWhere('venue.venueType = :venueType', { venueType });
    }

    if (minCapacity) {
      qb.andWhere('venue.capacity >= :minCapacity', { minCapacity });
    }

    if (maxCapacity) {
      qb.andWhere('venue.capacity <= :maxCapacity', { maxCapacity });
    }

    if (minPrice) {
      qb.andWhere('venue.pricePerHour >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      qb.andWhere('venue.pricePerHour <= :maxPrice', { maxPrice });
    }

    if (minRating) {
      qb.andWhere('venue.rating >= :minRating', { minRating });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(venue.venueName) LIKE LOWER(:search) OR LOWER(venue.address) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    qb.orderBy('venue.rating', 'DESC')
      .addOrderBy('venue.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [venues, total] = await qb.getManyAndCount();

    return {
      venues,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findNearby(latitude: number, longitude: number, radiusKm = 10, limit = 20) {
    // Using Haversine formula for distance calculation
    // For production with PostGIS, use ST_DWithin
    const qb = this.venuesRepository.createQueryBuilder('venue');

    qb.addSelect(
      `(6371 * acos(cos(radians(:lat)) * cos(radians(venue.latitude)) * cos(radians(venue.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(venue.latitude))))`,
      'distance',
    );

    qb.where('venue.status = :status', { status: VenueStatus.APPROVED })
      .setParameters({ lat: latitude, lng: longitude })
      .having('distance <= :radius', { radius: radiusKm })
      .orderBy('distance', 'ASC')
      .limit(limit);

    const venues = await qb.getRawAndEntities();

    return venues.entities.map((venue, index) => ({
      ...venue,
      distance: parseFloat(venues.raw[index]?.distance || '0'),
    }));
  }

  async findOne(id: string) {
    const venue = await this.venuesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    return venue;
  }

  async update(id: string, updateVenueDto: UpdateVenueDto, user: User) {
    const venue = await this.findOne(id);

    if (venue.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own venues');
    }

    Object.assign(venue, updateVenueDto);
    return this.venuesRepository.save(venue);
  }

  async remove(id: string, user: User) {
    const venue = await this.findOne(id);

    if (venue.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own venues');
    }

    await this.venuesRepository.remove(venue);
    return { message: 'Venue deleted successfully' };
  }

  async findByOwner(ownerId: string, page = 1, limit = 10) {
    const [venues, total] = await this.venuesRepository.findAndCount({
      where: { ownerId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { venues, total, page, totalPages: Math.ceil(total / limit) };
  }

  // Blocked dates management
  async addBlockedDate(venueId: string, blockedDate: string, reason: string, userId: string) {
    const venue = await this.findOne(venueId);

    const blocked = this.blockedDatesRepository.create({
      venueId,
      blockedDate,
      reason,
      createdBy: userId,
    });

    return this.blockedDatesRepository.save(blocked);
  }

  async getBlockedDates(venueId: string) {
    return this.blockedDatesRepository.find({
      where: { venueId },
      order: { blockedDate: 'ASC' },
    });
  }

  async removeBlockedDate(id: string) {
    const blocked = await this.blockedDatesRepository.findOne({ where: { id } });
    if (!blocked) {
      throw new NotFoundException('Blocked date not found');
    }
    await this.blockedDatesRepository.remove(blocked);
    return { message: 'Blocked date removed' };
  }

  // Admin methods
  async updateStatus(id: string, status: VenueStatus) {
    const venue = await this.findOne(id);
    venue.status = status;
    return this.venuesRepository.save(venue);
  }

  async findAllAdmin(page = 1, limit = 20, status?: VenueStatus) {
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
}
