import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

describe('BookingController', () => {
  let controller: BookingController;

  beforeEach(async () => {
    const mockBookingService = {
      createBooking: jest.fn(),
      verifyPayment: jest.fn(),
      cancelPayment: jest.fn(),
      getCustomerBookings: jest.fn(),
      cancelBooking: jest.fn(),
      simulateMockPay: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
