import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { Venue } from '../venues/entities/venue.entity';

const mockQb = {
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getRawOne: jest.fn().mockResolvedValue({ avgRating: '4.5', count: '2' }),
};

const mockReviewRepo = {
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQb),
};

const mockBookingRepo = { findOne: jest.fn() };
const mockVenueRepo = { findOne: jest.fn(), update: jest.fn() };

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: mockReviewRepo },
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepo },
        { provide: getRepositoryToken(Venue), useValue: mockVenueRepo },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
    mockReviewRepo.createQueryBuilder.mockReturnValue(mockQb);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a review after completed booking', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'v-1' });
      mockBookingRepo.findOne.mockResolvedValue({ id: 'b-1', bookingStatus: BookingStatus.COMPLETED });
      mockReviewRepo.findOne.mockResolvedValue(null);

      const review = { id: 'r-1', rating: 5, comment: 'Great!' };
      mockReviewRepo.create.mockReturnValue(review);
      mockReviewRepo.save.mockResolvedValue(review);
      mockVenueRepo.update.mockResolvedValue({});

      const result = await service.create('v-1', 'u-1', 5, 'Great!');
      expect(result.rating).toBe(5);
    });

    it('should throw NotFoundException for missing venue', async () => {
      mockVenueRepo.findOne.mockResolvedValue(null);
      await expect(service.create('bad', 'u-1', 5, '')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException without completed booking', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'v-1' });
      mockBookingRepo.findOne.mockResolvedValue(null);
      await expect(service.create('v-1', 'u-1', 5, '')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException for duplicate review', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'v-1' });
      mockBookingRepo.findOne.mockResolvedValue({ id: 'b-1' });
      mockReviewRepo.findOne.mockResolvedValue({ id: 'existing' });
      await expect(service.create('v-1', 'u-1', 5, '')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid rating', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'v-1' });
      mockBookingRepo.findOne.mockResolvedValue({ id: 'b-1' });
      mockReviewRepo.findOne.mockResolvedValue(null);
      await expect(service.create('v-1', 'u-1', 6, '')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByVenue', () => {
    it('should return paginated reviews', async () => {
      const reviews = [{ id: 'r-1', rating: 4 }];
      mockReviewRepo.findAndCount.mockResolvedValue([reviews, 1]);

      const result = await service.findByVenue('v-1', 1, 10);
      expect(result.reviews).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});
