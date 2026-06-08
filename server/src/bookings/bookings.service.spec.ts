import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking, BookingStatus } from './entities/booking.entity';
import { BookingLock, LockStatus } from '../booking-locks/entities/booking-lock.entity';
import { Venue } from '../venues/entities/venue.entity';
import { UserRole } from '../users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

const mockQb = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getCount: jest.fn().mockResolvedValue(0),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  getRawOne: jest.fn().mockResolvedValue({ totalRevenue: '0' }),
  getOne: jest.fn().mockResolvedValue(null),
};

const mockBookingRepo = {
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn().mockResolvedValue(0),
  createQueryBuilder: jest.fn().mockReturnValue(mockQb),
};

const mockLockRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockVenueRepo = {
  findOne: jest.fn(),
};

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepo },
        { provide: getRepositoryToken(BookingLock), useValue: mockLockRepo },
        { provide: getRepositoryToken(Venue), useValue: mockVenueRepo },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
    mockBookingRepo.createQueryBuilder.mockReturnValue(mockQb);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      venueId: 'venue-1', bookingDate: '2025-06-15',
      startTime: '10:00', endTime: '14:00', guestCount: 50,
    };

    it('should create a booking successfully', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'venue-1', pricePerHour: 1000 });
      mockQb.getOne.mockResolvedValue(null); // no overlap

      const booking = { id: 'b-1', ...dto, bookingCode: 'BMV-ABC', totalAmount: 4000 };
      mockBookingRepo.create.mockReturnValue(booking);
      mockBookingRepo.save.mockResolvedValue(booking);

      const result = await service.create(dto, 'user-1');
      expect(result.venueId).toBe('venue-1');
      expect(mockBookingRepo.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if venue not found', async () => {
      mockVenueRepo.findOne.mockResolvedValue(null);
      await expect(service.create(dto, 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException on overlapping booking', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'venue-1', pricePerHour: 1000 });
      mockQb.getOne.mockResolvedValue({ id: 'overlap-1', startTime: '10:00', endTime: '14:00' }); // overlap exists

      await expect(service.create(dto, 'user-1')).rejects.toThrow(ConflictException);
    });

    it('should validate and consume lock if lockId is provided', async () => {
      const dtoWithLock = { ...dto, lockId: 'lock-1' };
      mockVenueRepo.findOne.mockResolvedValue({ id: 'venue-1', pricePerHour: 1000 });
      mockQb.getOne.mockResolvedValue(null);
      mockLockRepo.findOne.mockResolvedValue({ id: 'lock-1', status: LockStatus.ACTIVE });
      mockLockRepo.save.mockResolvedValue({});

      const booking = { id: 'b-1', ...dtoWithLock, bookingCode: 'BMV-DEF', totalAmount: 4000 };
      mockBookingRepo.create.mockReturnValue(booking);
      mockBookingRepo.save.mockResolvedValue(booking);

      await service.create(dtoWithLock, 'user-1');
      expect(mockLockRepo.save).toHaveBeenCalledWith(expect.objectContaining({ status: LockStatus.USED }));
    });
  });

  describe('updateStatus', () => {
    it('should allow owner to confirm booking', async () => {
      const booking = {
        id: 'b-1', userId: 'user-1', bookingStatus: BookingStatus.PENDING,
        venue: { ownerId: 'owner-1' },
      };
      mockBookingRepo.findOne.mockResolvedValue(booking);
      mockBookingRepo.save.mockImplementation((b) => Promise.resolve(b));

      const user = { id: 'owner-1', role: UserRole.VENUE_OWNER } as any;
      const result = await service.updateStatus('b-1', BookingStatus.CONFIRMED, user);
      expect(result.bookingStatus).toBe(BookingStatus.CONFIRMED);
    });

    it('should allow user to cancel their booking', async () => {
      const booking = {
        id: 'b-1', userId: 'user-1', bookingStatus: BookingStatus.PENDING,
        venue: { ownerId: 'owner-1' },
      };
      mockBookingRepo.findOne.mockResolvedValue(booking);
      mockBookingRepo.save.mockImplementation((b) => Promise.resolve(b));

      const user = { id: 'user-1', role: UserRole.USER } as any;
      const result = await service.updateStatus('b-1', BookingStatus.CANCELLED, user);
      expect(result.bookingStatus).toBe(BookingStatus.CANCELLED);
    });

    it('should throw ForbiddenException if user tries non-cancel action', async () => {
      const booking = {
        id: 'b-1', userId: 'user-1',
        venue: { ownerId: 'owner-1' },
      };
      mockBookingRepo.findOne.mockResolvedValue(booking);

      const user = { id: 'user-1', role: UserRole.USER } as any;
      await expect(service.updateStatus('b-1', BookingStatus.CONFIRMED, user)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException for invalid booking', async () => {
      mockBookingRepo.findOne.mockResolvedValue(null);
      const user = { id: 'user-1', role: UserRole.USER } as any;
      await expect(service.updateStatus('bad-id', BookingStatus.CANCELLED, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return booking with relations', async () => {
      const booking = { id: 'b-1', venue: {}, user: {} };
      mockBookingRepo.findOne.mockResolvedValue(booking);
      const result = await service.findOne('b-1');
      expect(result.id).toBe('b-1');
    });

    it('should throw NotFoundException', async () => {
      mockBookingRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
