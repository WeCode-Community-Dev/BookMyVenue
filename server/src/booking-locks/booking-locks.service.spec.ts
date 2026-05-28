import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BookingLocksService } from './booking-locks.service';
import { BookingLock, LockStatus } from './entities/booking-lock.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { Venue } from '../venues/entities/venue.entity';

const mockLockRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockBookingRepo = {
  findOne: jest.fn(),
};

const mockVenueRepo = {
  findOne: jest.fn(),
};

describe('BookingLocksService', () => {
  let service: BookingLocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingLocksService,
        { provide: getRepositoryToken(BookingLock), useValue: mockLockRepo },
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepo },
        { provide: getRepositoryToken(Venue), useValue: mockVenueRepo },
      ],
    }).compile();

    service = module.get<BookingLocksService>(BookingLocksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('lockSlot', () => {
    it('should create a lock for an available slot', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'v-1' });
      mockLockRepo.findOne.mockResolvedValue(null);
      mockBookingRepo.findOne.mockResolvedValue(null);

      const lock = { id: 'lock-1', status: LockStatus.ACTIVE };
      mockLockRepo.create.mockReturnValue(lock);
      mockLockRepo.save.mockResolvedValue(lock);

      const result = await service.lockSlot('v-1', '2025-06-15', '10:00', '14:00', 'user-1');
      expect(result.status).toBe(LockStatus.ACTIVE);
    });

    it('should throw NotFoundException if venue missing', async () => {
      mockVenueRepo.findOne.mockResolvedValue(null);
      await expect(service.lockSlot('bad', '2025-06-15', '10:00', '14:00', 'u-1'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if slot is actively locked', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'v-1' });
      mockLockRepo.findOne.mockResolvedValue({
        id: 'lock-1', startTime: '10:00', endTime: '14:00',
        status: LockStatus.ACTIVE, expiresAt: new Date(Date.now() + 300000),
      });

      await expect(service.lockSlot('v-1', '2025-06-15', '11:00', '13:00', 'u-1'))
        .rejects.toThrow(ConflictException);
    });

    it('should expire old lock and create new one', async () => {
      mockVenueRepo.findOne.mockResolvedValue({ id: 'v-1' });
      const expiredLock = {
        id: 'lock-old', startTime: '10:00', endTime: '14:00',
        status: LockStatus.ACTIVE, expiresAt: new Date(Date.now() - 1000),
      };
      mockLockRepo.findOne.mockResolvedValue(expiredLock);
      mockLockRepo.save.mockResolvedValue(expiredLock);
      mockBookingRepo.findOne.mockResolvedValue(null);

      const newLock = { id: 'lock-new', status: LockStatus.ACTIVE };
      mockLockRepo.create.mockReturnValue(newLock);
      mockLockRepo.save.mockResolvedValue(newLock);

      const result = await service.lockSlot('v-1', '2025-06-15', '10:00', '14:00', 'u-1');
      expect(result.status).toBe(LockStatus.ACTIVE);
    });
  });

  describe('releaseLock', () => {
    it('should release own lock', async () => {
      const lock = { id: 'lock-1', lockedByUserId: 'user-1', status: LockStatus.ACTIVE };
      mockLockRepo.findOne.mockResolvedValue(lock);
      mockLockRepo.save.mockImplementation((l) => Promise.resolve(l));

      const result = await service.releaseLock('lock-1', 'user-1');
      expect(result.status).toBe(LockStatus.RELEASED);
    });

    it('should throw ForbiddenException for other user lock', async () => {
      mockLockRepo.findOne.mockResolvedValue({ id: 'lock-1', lockedByUserId: 'other' });
      await expect(service.releaseLock('lock-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException for missing lock', async () => {
      mockLockRepo.findOne.mockResolvedValue(null);
      await expect(service.releaseLock('bad-id', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('expireStaleLocksJob', () => {
    it('should update expired locks', async () => {
      mockLockRepo.update.mockResolvedValue({ affected: 3 });
      await service.expireStaleLocksJob();
      expect(mockLockRepo.update).toHaveBeenCalled();
    });
  });
});
