import { Test, TestingModule } from '@nestjs/testing';
import { AdminVenueService } from './admin-venue.service';

describe('AdminVenueService', () => {
  let service: AdminVenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminVenueService],
    }).compile();

    service = module.get<AdminVenueService>(AdminVenueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
