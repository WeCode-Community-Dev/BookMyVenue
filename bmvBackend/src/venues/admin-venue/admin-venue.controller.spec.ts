import { Test, TestingModule } from '@nestjs/testing';
import { AdminVenueController } from './admin-venue.controller';

describe('AdminVenueController', () => {
  let controller: AdminVenueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminVenueController],
    }).compile();

    controller = module.get<AdminVenueController>(AdminVenueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
