import { Controller, Get, Param, Post, Body, Patch, NotFoundException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.bookingsService.findByUser(userId);
  }

  @Get('venue/:venueId')
  async findByVenue(@Param('venueId') venueId: string) {
    return this.bookingsService.findByVenue(venueId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const booking = await this.bookingsService.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const booking = await this.bookingsService.updateStatus(id, status);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }
}
