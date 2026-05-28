import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { Venue } from '../venues/entities/venue.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async create(venueId: string, userId: string, rating: number, comment: string) {
    const venue = await this.venuesRepository.findOne({ where: { id: venueId } });
    if (!venue) throw new NotFoundException('Venue not found');

    const booking = await this.bookingsRepository.findOne({
      where: { userId, venueId, bookingStatus: BookingStatus.COMPLETED },
    });
    if (!booking) throw new ForbiddenException('You can only review venues where you have completed a booking');

    const existingReview = await this.reviewsRepository.findOne({ where: { userId, venueId } });
    if (existingReview) throw new BadRequestException('You have already reviewed this venue');

    if (rating < 1 || rating > 5) throw new BadRequestException('Rating must be between 1 and 5');

    const review = this.reviewsRepository.create({ userId, venueId, rating, comment });
    await this.reviewsRepository.save(review);
    await this.updateVenueRating(venueId);
    return review;
  }

  async findByVenue(venueId: string, page = 1, limit = 10) {
    const [reviews, total] = await this.reviewsRepository.findAndCount({
      where: { venueId },
      relations: { user: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { reviews, total, page, totalPages: Math.ceil(total / limit) };
  }

  private async updateVenueRating(venueId: string) {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.venueId = :venueId', { venueId })
      .getRawOne();

    await this.venuesRepository.update(venueId, {
      rating: parseFloat(result.avgRating) || 0,
      reviewCount: parseInt(result.count) || 0,
    });
  }
}
