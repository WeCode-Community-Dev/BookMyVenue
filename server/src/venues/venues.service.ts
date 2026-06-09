import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as https from 'https';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { Venue, VenueStatus, VenueType } from './entities/venue.entity';
import { VenueBlockedDate } from './entities/venue-blocked-date.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { CloudinaryService } from './cloudinary.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
    @InjectRepository(VenueBlockedDate)
    private blockedDatesRepository: Repository<VenueBlockedDate>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private cloudinaryService: CloudinaryService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createVenueDto: CreateVenueDto, ownerId: string) {
    let uploadedImages: string[] = [];
    if (createVenueDto.images && createVenueDto.images.length > 0) {
      uploadedImages = await this.cloudinaryService.uploadImages(createVenueDto.images);
    }

    const venue = this.venuesRepository.create({
      ...createVenueDto,
      images: uploadedImages,
      ownerId,
      status: VenueStatus.PENDING,
    });

    const savedVenue = await this.venuesRepository.save(venue);
    
    // Emit event asynchronously for venue listed congratulations email
    this.eventEmitter.emit('venue.created', { venueId: savedVenue.id });

    return savedVenue;
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
        '(LOWER(venue.venueName) LIKE LOWER(:search) OR LOWER(venue.address) LIKE LOWER(:search) OR LOWER(venue.description) LIKE LOWER(:search) OR LOWER(CAST(venue.venueType AS text)) LIKE LOWER(:search))',
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
      .andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(venue.latitude)) * cos(radians(venue.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(venue.latitude)))) <= :radius`,
        { radius: radiusKm },
      )
      .setParameters({ lat: latitude, lng: longitude })
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
      relations: { owner: true, bookings: true },
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

    let uploadedImages = venue.images;
    if (updateVenueDto.images) {
      uploadedImages = await this.cloudinaryService.uploadImages(updateVenueDto.images);
    }

    Object.assign(venue, {
      ...updateVenueDto,
      images: uploadedImages,
    });

    if (user.role === UserRole.VENUE_OWNER) {
      venue.status = VenueStatus.PENDING;
    }

    const savedVenue = await this.venuesRepository.save(venue);

    // Emit event asynchronously for venue updated notification email
    this.eventEmitter.emit('venue.updated', { venueId: savedVenue.id });

    return savedVenue;
  }

  async remove(id: string, user: User) {
    const venue = await this.findOne(id);

    if (venue.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own venues');
    }

    // Check if the venue is currently being used by future or current bookings
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const activeBookingCount = await this.bookingsRepository.count({
      where: {
        venueId: id,
        bookingStatus: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
        bookingDate: MoreThanOrEqual(todayStr),
      },
    });

    if (activeBookingCount > 0) {
      throw new BadRequestException(
        'Cannot delete this space because it is currently in use or has pending/confirmed bookings reservations scheduled for today or in the future.',
      );
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

    const existingBlock = await this.blockedDatesRepository.findOne({
      where: { venueId, blockedDate },
    });
    if (existingBlock) {
      throw new BadRequestException('This date is already blocked for this venue.');
    }

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

  async geocode(query: string): Promise<any[]> {
    return new Promise((resolve) => {
      if (!query || query.trim().length < 3) {
        return resolve([]);
      }
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`;
      
      const options = {
        headers: {
          'User-Agent': 'BookMyVenue/1.0',
        },
      };

      https.get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const features = parsed.features || [];
            
            const results = features.map((feature: any) => {
              const props = feature.properties || {};
              const name = props.name || '';
              const street = props.street ? `${props.street}, ` : '';
              const city = props.city ? `${props.city}, ` : '';
              const county = props.county ? `${props.county}, ` : '';
              const state = props.state ? `${props.state}, ` : '';
              const country = props.country || '';

              let displayName = `${street}${name}, ${city}${county}${state}${country}`
                .replace(/,\s*,/g, ',')
                .replace(/^,\s*/, '')
                .replace(/,\s*$/, '')
                .trim();

              return {
                display_name: displayName,
                lat: feature.geometry?.coordinates?.[1] || 13.0827,
                lon: feature.geometry?.coordinates?.[0] || 80.2707,
              };
            });

            resolve(results);
          } catch (e) {
            resolve([]);
          }
        });
      }).on('error', () => {
        resolve([]);
      });
    });
  }
}
