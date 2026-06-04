import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService: unknown = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    role: {
      upsert: jest.fn(),
    },
    userRole: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
      callback(mockPrismaService),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService as PrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
