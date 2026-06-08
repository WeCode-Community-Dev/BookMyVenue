import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { Venue, VenueStatus, VenueType } from './entities/venue.entity';
import { VenueBlockedDate } from './entities/venue-blocked-date.entity';
import { UserRole } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CloudinaryService } from './cloudinary.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  having: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  getRawAndEntities: jest.fn().mockResolvedValue({ entities: [], raw: [] }),
};

const mockVenueRepo = {
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

const mockBlockedDatesRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockBookingRepo = {
  count: jest.fn(),
};

const mockCloudinaryService = {
  uploadImages: jest.fn().mockResolvedValue([]),
};

const mockEventEmitter = {
  emit: jest.fn(),
};

describe('VenuesService', () => {
  let service: VenuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VenuesService,
        { provide: getRepositoryToken(Venue), useValue: mockVenueRepo },
        { provide: getRepositoryToken(VenueBlockedDate), useValue: mockBlockedDatesRepo },
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepo },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<VenuesService>(VenuesService);
    jest.clearAllMocks();
    mockVenueRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a venue with pending status', async () => {
      const dto = {
        venueName: 'Test Hall', venueType: VenueType.BANQUET_HALL,
        address: '123 St', latitude: 13, longitude: 80, capacity: 100, pricePerHour: 500,
      };
      const venue = { id: 'uuid-1', ...dto, status: VenueStatus.PENDING, ownerId: 'owner-1' };
      mockVenueRepo.create.mockReturnValue(venue);
      mockVenueRepo.save.mockResolvedValue(venue);

      const result = await service.create(dto as any, 'owner-1');

      expect(result.status).toBe(VenueStatus.PENDING);
      expect(result.ownerId).toBe('owner-1');
    });
  });

  describe('findOne', () => {
    it('should return venue with owner relation', async () => {
      const venue = { id: 'uuid-1', venueName: 'Test', owner: { name: 'Owner' } };
      mockVenueRepo.findOne.mockResolvedValue(venue);

      const result = await service.findOne('uuid-1');
      expect(result.venueName).toBe('Test');
    });

    it('should throw NotFoundException', async () => {
      mockVenueRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should allow owner to update their venue', async () => {
      const venue = { id: 'uuid-1', ownerId: 'owner-1', venueName: 'Old' };
      mockVenueRepo.findOne.mockResolvedValue(venue);
      mockVenueRepo.save.mockImplementation((v) => Promise.resolve(v));

      const user = { id: 'owner-1', role: UserRole.VENUE_OWNER } as any;
      const result = await service.update('uuid-1', { venueName: 'New' }, user);
      expect(result.venueName).toBe('New');
    });

    it('should throw ForbiddenException for non-owner', async () => {
      const venue = { id: 'uuid-1', ownerId: 'owner-1' };
      mockVenueRepo.findOne.mockResolvedValue(venue);

      const user = { id: 'other-user', role: UserRole.USER } as any;
      await expect(service.update('uuid-1', {}, user)).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to update any venue', async () => {
      const venue = { id: 'uuid-1', ownerId: 'owner-1', venueName: 'Old' };
      mockVenueRepo.findOne.mockResolvedValue(venue);
      mockVenueRepo.save.mockImplementation((v) => Promise.resolve(v));

      const user = { id: 'admin-1', role: UserRole.ADMIN } as any;
      const result = await service.update('uuid-1', { venueName: 'Admin Updated' }, user);
      expect(result.venueName).toBe('Admin Updated');
    });
  });

  describe('remove', () => {
    it('should throw ForbiddenException for non-owner', async () => {
      const venue = { id: 'uuid-1', ownerId: 'owner-1' };
      mockVenueRepo.findOne.mockResolvedValue(venue);
      const user = { id: 'other', role: UserRole.USER } as any;
      await expect(service.remove('uuid-1', user)).rejects.toThrow(ForbiddenException);
    });

    it('should allow owner to delete if there are no active bookings', async () => {
      const venue = { id: 'uuid-1', ownerId: 'owner-1' };
      mockVenueRepo.findOne.mockResolvedValue(venue);
      mockBookingRepo.count.mockResolvedValue(0);
      mockVenueRepo.remove.mockResolvedValue(venue);

      const user = { id: 'owner-1', role: UserRole.VENUE_OWNER } as any;
      const result = await service.remove('uuid-1', user);
      expect(result.message).toBe('Venue deleted successfully');
    });

    it('should throw BadRequestException if there are active bookings', async () => {
      const venue = { id: 'uuid-1', ownerId: 'owner-1' };
      mockVenueRepo.findOne.mockResolvedValue(venue);
      mockBookingRepo.count.mockResolvedValue(5);

      const user = { id: 'owner-1', role: UserRole.VENUE_OWNER } as any;
      await expect(service.remove('uuid-1', user)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should query with filters', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll({ page: 1, limit: 10, venueType: VenueType.CAFE });

      expect(result.venues).toEqual([]);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update venue status', async () => {
      const venue = { id: 'uuid-1', status: VenueStatus.PENDING };
      mockVenueRepo.findOne.mockResolvedValue(venue);
      mockVenueRepo.save.mockImplementation((v) => Promise.resolve(v));

      const result = await service.updateStatus('uuid-1', VenueStatus.APPROVED);
      expect(result.status).toBe(VenueStatus.APPROVED);
    });
  });

  describe('blocked dates', () => {
    it('should add a blocked date', async () => {
      const venue = { id: 'venue-1' };
      mockVenueRepo.findOne.mockResolvedValue(venue);
      const blocked = { id: 'bd-1', venueId: 'venue-1', blockedDate: '2025-12-25' };
      mockBlockedDatesRepo.create.mockReturnValue(blocked);
      mockBlockedDatesRepo.save.mockResolvedValue(blocked);

      const result = await service.addBlockedDate('venue-1', '2025-12-25', 'Holiday', 'user-1');
      expect(result.blockedDate).toBe('2025-12-25');
    });

    it('should throw NotFoundException when removing nonexistent blocked date', async () => {
      mockBlockedDatesRepo.findOne.mockResolvedValue(null);
      await expect(service.removeBlockedDate('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
