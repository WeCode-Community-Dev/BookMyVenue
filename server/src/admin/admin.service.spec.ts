import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { Venue, VenueStatus } from '../venues/entities/venue.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

const mockQb = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  loadRelationCountAndMap: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  addGroupBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  getRawOne: jest.fn().mockResolvedValue({ totalRevenue: '5000' }),
  getRawMany: jest.fn().mockResolvedValue([]),
};

const mockUserRepo = {
  findOne: jest.fn(),
  count: jest.fn().mockResolvedValue(10),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQb),
};

const mockVenueRepo = {
  findOne: jest.fn(),
  findAndCount: jest.fn().mockResolvedValue([[], 0]),
  count: jest.fn().mockResolvedValue(5),
  save: jest.fn(),
};

const mockBookingRepo = {
  findOne: jest.fn(),
  findAndCount: jest.fn().mockResolvedValue([[], 0]),
  count: jest.fn().mockResolvedValue(20),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQb),
};

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Venue), useValue: mockVenueRepo },
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepo },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    jest.clearAllMocks();
    mockUserRepo.createQueryBuilder.mockReturnValue(mockQb);
    mockBookingRepo.createQueryBuilder.mockReturnValue(mockQb);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateUserStatus', () => {
    it('should block a user', async () => {
      const user = { id: 'u-1', status: UserStatus.ACTIVE };
      mockUserRepo.findOne.mockResolvedValue(user);
      mockUserRepo.save.mockImplementation((u) => Promise.resolve(u));

      const result = await service.updateUserStatus('u-1', UserStatus.BLOCKED);
      expect(result.status).toBe(UserStatus.BLOCKED);
    });

    it('should throw NotFoundException for missing user', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.updateUserStatus('bad', UserStatus.BLOCKED)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateVenueStatus', () => {
    it('should approve a venue', async () => {
      const venue = { id: 'v-1', status: VenueStatus.PENDING };
      mockVenueRepo.findOne.mockResolvedValue(venue);
      mockVenueRepo.save.mockImplementation((v) => Promise.resolve(v));

      const result = await service.updateVenueStatus('v-1', VenueStatus.APPROVED);
      expect(result.status).toBe(VenueStatus.APPROVED);
    });

    it('should throw NotFoundException for missing venue', async () => {
      mockVenueRepo.findOne.mockResolvedValue(null);
      await expect(service.updateVenueStatus('bad', VenueStatus.APPROVED)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBookingStatus', () => {
    it('should cancel a booking', async () => {
      const booking = { id: 'b-1', bookingStatus: BookingStatus.PENDING };
      mockBookingRepo.findOne.mockResolvedValue(booking);
      mockBookingRepo.save.mockImplementation((b) => Promise.resolve(b));

      const result = await service.updateBookingStatus('b-1', BookingStatus.CANCELLED);
      expect(result.bookingStatus).toBe(BookingStatus.CANCELLED);
    });

    it('should throw NotFoundException', async () => {
      mockBookingRepo.findOne.mockResolvedValue(null);
      await expect(service.updateBookingStatus('bad', BookingStatus.CANCELLED)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAnalytics', () => {
    it('should return platform analytics', async () => {
      const result = await service.getAnalytics();
      expect(result).toHaveProperty('users');
      expect(result).toHaveProperty('venues');
      expect(result).toHaveProperty('bookings');
      expect(result).toHaveProperty('totalRevenue');
      expect(result).toHaveProperty('popularVenues');
    });
  });
});
