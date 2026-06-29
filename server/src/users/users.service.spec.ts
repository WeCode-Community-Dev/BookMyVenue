import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStatus } from './entities/user.entity';

const mockUserRepository = {
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [{ id: '1', name: 'John' }];
      mockUserRepository.findAndCount.mockResolvedValue([users, 1]);

      const result = await service.findAll(1, 10);

      expect(result.users).toEqual(users);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should calculate totalPages correctly', async () => {
      mockUserRepository.findAndCount.mockResolvedValue([[], 25]);
      const result = await service.findAll(1, 10);
      expect(result.totalPages).toBe(3);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const user = { id: 'uuid-1', name: 'John' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update user status', async () => {
      const user = { id: 'uuid-1', status: UserStatus.ACTIVE };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue({ ...user, status: UserStatus.BLOCKED });

      const result = await service.updateStatus('uuid-1', UserStatus.BLOCKED);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: UserStatus.BLOCKED }));
    });
  });

  describe('updateProfile', () => {
    it('should update user profile fields', async () => {
      const user = { id: 'uuid-1', name: 'Old Name' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockImplementation((u) => Promise.resolve(u));

      const result = await service.updateProfile('uuid-1', { name: 'New Name' });
      expect(result.name).toBe('New Name');
    });
  });
});
