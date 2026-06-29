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

    const originalStatus = venue.status;

    let uploadedImages = venue.images;
    if (updateVenueDto.images) {
      uploadedImages = await this.cloudinaryService.uploadImages(updateVenueDto.images);
    }

    Object.assign(venue, {
      ...updateVenueDto,
      images: uploadedImages,
    });

    if (user.role === UserRole.VENUE_OWNER) {
      if (originalStatus === VenueStatus.APPROVED) {
        venue.status = VenueStatus.APPROVED;
      } else {
        venue.status = VenueStatus.PENDING;
      }
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

  private cleanGeocodeQuery(query: string): string {
    let cleaned = query.replace(/[&,-]/g, ' ');
    const stopPatterns = [
      /\bconvention\s+centre\b/gi,
      /\bconvention\s+center\b/gi,
      /\bbanquet\s+hall\b/gi,
      /\bevent\s+space\b/gi,
      /\bwedding\s+hall\b/gi,
      /\bmeetup\s+space\b/gi,
      /\bconference\s+room\b/gi,
      /\bhotel\b/gi,
      /\bresort\b/gi,
    ];
    for (const pattern of stopPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }
    return cleaned.replace(/\s+/g, ' ').trim();
  }

  private getDiceSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;
    
    const bigrams1 = new Set<string>();
    for (let i = 0; i < s1.length - 1; i++) {
      bigrams1.add(s1.substring(i, i + 2));
    }
    
    const bigrams2 = new Set<string>();
    for (let i = 0; i < s2.length - 1; i++) {
      bigrams2.add(s2.substring(i, i + 2));
    }
    
    let intersection = 0;
    for (const b of bigrams2) {
      if (bigrams1.has(b)) {
        intersection++;
      }
    }
    
    if (bigrams1.size + bigrams2.size === 0) return 0;
    return (2.0 * intersection) / (bigrams1.size + bigrams2.size);
  }

  async geocode(query: string, biasLat?: number, biasLon?: number): Promise<any[]> {
    return new Promise(async (resolve) => {
      if (!query || query.trim().length < 3) {
        return resolve([]);
      }

      // Default to Kochi, Kerala, India coordinate if no bias is provided
      const lat = biasLat !== undefined ? biasLat : 9.9880;
      const lon = biasLon !== undefined ? biasLon : 76.3023;

      const urlsToTry = [
        // 1. Direct query with bias
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&limit=15`
      ];

      const cleaned = this.cleanGeocodeQuery(query);
      if (cleaned !== query && cleaned.length >= 3) {
        // 2. Cleaned query with bias
        urlsToTry.push(`https://photon.komoot.io/api/?q=${encodeURIComponent(cleaned)}&lat=${lat}&lon=${lon}&limit=15`);
      }

      // 3. Significant individual words
      const words = cleaned.split(' ').filter(w => w.length >= 3);
      if (words.length >= 2) {
        for (const word of words) {
          urlsToTry.push(`https://photon.komoot.io/api/?q=${encodeURIComponent(word)}&lat=${lat}&lon=${lon}&limit=15`);
        }
      }

      const options = {
        headers: {
          'User-Agent': 'BookMyVenue/1.0',
        },
      };

      try {
        const fetchPromises = urlsToTry.map((url) => {
          return new Promise<any[]>((resolveFetch) => {
            https.get(url, options, (res) => {
              let data = '';
              res.on('data', (chunk) => { data += chunk; });
              res.on('end', () => {
                try {
                  const parsed = JSON.parse(data);
                  resolveFetch(parsed.features || []);
                } catch {
                  resolveFetch([]);
                }
              });
            }).on('error', () => {
              resolveFetch([]);
            });
          });
        });

        const allResults = await Promise.all(fetchPromises);
        
        // Merge and deduplicate by osm_id
        const features: any[] = [];
        const existingIds = new Set<number>();

        for (const list of allResults) {
          for (const f of list) {
            const id = f.properties?.osm_id;
            if (id && !existingIds.has(id)) {
              features.push(f);
              existingIds.add(id);
            }
          }
        }

        // Rank features
        const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length >= 3);

        features.sort((a, b) => {
          const propsA = a.properties || {};
          const propsB = b.properties || {};
          const nameA = (propsA.name || '').toLowerCase();
          const nameB = (propsB.name || '').toLowerCase();
          const cityA = (propsA.city || '').toLowerCase();
          const cityB = (propsB.city || '').toLowerCase();
          const stateA = (propsA.state || '').toLowerCase();
          const stateB = (propsB.state || '').toLowerCase();
          const countryA = (propsA.country || '').toLowerCase();
          const countryB = (propsB.country || '').toLowerCase();

          let scoreA = 0;
          let scoreB = 0;

          const wordsA = nameA.split(/\s+/).filter((w: string) => w.length >= 3);
          const wordsB = nameB.split(/\s+/).filter((w: string) => w.length >= 3);

          for (const qw of queryWords) {
            let maxSimA = 0;
            for (const wa of wordsA) {
              const sim = this.getDiceSimilarity(qw, wa);
              if (sim > maxSimA) maxSimA = sim;
            }
            scoreA += maxSimA * 20;

            let maxSimB = 0;
            for (const wb of wordsB) {
              const sim = this.getDiceSimilarity(qw, wb);
              if (sim > maxSimB) maxSimB = sim;
            }
            scoreB += maxSimB * 20;

            if (cityA.includes(qw)) scoreA += 5;
            if (cityB.includes(qw)) scoreB += 5;
            if (stateA.includes(qw)) scoreA += 3;
            if (stateB.includes(qw)) scoreB += 3;
          }

          // Country bias (India)
          const isIndiaA = countryA === 'india' || propsA.countrycode === 'IN';
          const isIndiaB = countryB === 'india' || propsB.countrycode === 'IN';
          if (isIndiaA && !isIndiaB) scoreA += 30;
          if (isIndiaB && !isIndiaA) scoreB += 30;

          // State bias (Kerala)
          const isKeralaA = stateA === 'kerala';
          const isKeralaB = stateB === 'kerala';
          if (isKeralaA && !isKeralaB) scoreA += 15;
          if (isKeralaB && !isKeralaA) scoreB += 15;

          // Distance bias
          const coordA = a.geometry?.coordinates;
          const coordB = b.geometry?.coordinates;

          if (coordA && coordB) {
            const distA = Math.sqrt(Math.pow(coordA[1] - lat, 2) + Math.pow(coordA[0] - lon, 2));
            const distB = Math.sqrt(Math.pow(coordB[1] - lat, 2) + Math.pow(coordB[0] - lon, 2));
            if (distA < distB) scoreA += 5;
            if (distB < distA) scoreB += 5;
          }

          return scoreB - scoreA;
        });

        // Format to simplified model expected by frontend
        let formatted = features.slice(0, 10).map((feature: any) => {
          const props = feature.properties || {};
          const name = props.name || '';
          const street = props.street ? `${props.street}, ` : '';
          const city = props.city ? `${props.city}, ` : '';
          const county = props.county ? `${props.county}, ` : '';
          const state = props.state ? `${props.state}, ` : '';
          const country = props.country || '';

          const displayName = `${street}${name}, ${city}${county}${state}${country}`
            .replace(/,\s*,/g, ',')
            .replace(/^,\s*/, '')
            .replace(/,\s*$/, '')
            .trim();

          return {
            display_name: displayName,
            lat: feature.geometry?.coordinates?.[1] || lat,
            lon: feature.geometry?.coordinates?.[0] || lon,
          };
        });

        // Dynamically add the typed query as a custom location option so users can pin any place
        if (query && query.trim().length >= 3) {
          let customLat = lat.toString();
          let customLon = lon.toString();
          if (features.length > 0) {
            const firstFeature = features[0];
            const coords = firstFeature.geometry?.coordinates;
            if (coords) {
              customLat = coords[1].toString();
              customLon = coords[0].toString();
            }
          }
          const customEntry = {
            display_name: query.trim(),
            lat: customLat,
            lon: customLon,
          };
          const alreadyExists = formatted.some(
            (item) => item.display_name.toLowerCase() === query.trim().toLowerCase(),
          );
          if (!alreadyExists) {
            formatted = [customEntry, ...formatted];
          }
        }

        resolve(formatted);
      } catch {
        resolve([]);
      }
    });
  }
}
