import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verifyAsync: jest.fn().mockResolvedValue({ sub: 'uuid-1', email: 'john@example.com', role: 'user' }),
};

const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    if (key === 'JWT_ACCESS_EXPIRES_IN') return '15m';
    if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
    return 'mock-secret';
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      const createdUser = { id: 'uuid-1', ...registerDto, role: UserRole.USER, status: UserStatus.ACTIVE };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(result.message).toBe('Registration successful');
      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).not.toHaveProperty('password');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
    });

    it('should throw ConflictException if email exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'existing' });
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should hash the password before saving', async () => {
      const createdUser = { id: 'uuid-1', ...registerDto, role: UserRole.USER };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      await service.register(registerDto);

      const createCall = mockUserRepository.create.mock.calls[0][0];
      expect(createCall.password).not.toBe('password123');
      expect(createCall.password.length).toBeGreaterThan(10);
    });

    it('should register with venue_owner role', async () => {
      const dto = { ...registerDto, role: UserRole.VENUE_OWNER };
      const createdUser = { id: 'uuid-1', ...dto };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      await service.register(dto);

      const createCall = mockUserRepository.create.mock.calls[0][0];
      expect(createCall.role).toBe(UserRole.VENUE_OWNER);
    });
  });

  describe('login', () => {
    const loginDto = { email: 'john@example.com', password: 'password123' };

    it('should login successfully with valid credentials', async () => {
      const hashedPw = await bcrypt.hash('password123', 10);
      const user = {
        id: 'uuid-1', name: 'John', email: 'john@example.com',
        password: hashedPw, role: UserRole.USER, status: UserStatus.ACTIVE,
      };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.login(loginDto);

      expect(result.message).toBe('Login successful');
      expect(result.token).toBe('mock-jwt-token');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const user = {
        id: 'uuid-1', email: 'john@example.com',
        password: await bcrypt.hash('different', 10),
        status: UserStatus.ACTIVE,
      };
      mockUserRepository.findOne.mockResolvedValue(user);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for blocked user', async () => {
      const user = {
        id: 'uuid-1', email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        status: UserStatus.BLOCKED,
      };
      mockUserRepository.findOne.mockResolvedValue(user);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should return success message even if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const result = await service.forgotPassword('unknown@test.com');
      expect(result.message).toContain('If an account exists');
    });

    it('should generate reset token for existing user', async () => {
      const user = { id: 'uuid-1', email: 'john@example.com' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.forgotPassword('john@example.com');
      expect(result.message).toContain('If an account exists');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException for invalid token', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.resetPassword('bad-token', 'newpass123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValueOnce(new Error('Invalid token'));
      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should successfully refresh tokens', async () => {
      const hashedRefreshToken = await bcrypt.hash('valid-refresh-token', 10);
      const user = {
        id: 'uuid-1',
        email: 'john@example.com',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        currentHashedRefreshToken: hashedRefreshToken,
      };

      mockJwtService.verifyAsync.mockResolvedValueOnce({ sub: 'uuid-1', email: 'john@example.com', role: 'user' });
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockUserRepository.update.mockResolvedValueOnce({} as any);

      const result = await service.refresh('valid-refresh-token');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('logout', () => {
    it('should clear refresh token', async () => {
      mockUserRepository.update.mockResolvedValueOnce({} as any);
      await service.logout('uuid-1');
      expect(mockUserRepository.update).toHaveBeenCalledWith('uuid-1', { currentHashedRefreshToken: null });
    });
  });
});
