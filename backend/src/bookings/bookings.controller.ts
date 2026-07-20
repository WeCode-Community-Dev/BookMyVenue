import { Controller, Get, Param, Post, Body, Patch, NotFoundException, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { RescheduleRequestDto } from './dto/reschedule-request.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { GetUser } from '../users/decorators/get-user.decorator';
import type { JWTUserInterface } from '../interface/jwt-user.interface';

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

  @Get('owner/:ownerId')
  async findByOwner(@Param('ownerId') ownerId: string) {
    return this.bookingsService.findByOwner(ownerId);
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
  @UseGuards(AuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
    @GetUser() user: JWTUserInterface,
  ) {
    const { status, cancellationReason, totalPrice } = updateBookingStatusDto;
    const booking = await this.bookingsService.updateStatus(id, status, user, cancellationReason, totalPrice);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  @Patch(':id/reschedule')
  @UseGuards(AuthGuard)
  async reschedule(
    @Param('id') id: string,
    @Body() rescheduleRequestDto: RescheduleRequestDto,
    @GetUser() user: JWTUserInterface,
  ) {
    const booking = await this.bookingsService.reschedule(id, rescheduleRequestDto, user);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  @Patch(':id/reschedule/approve')
  @UseGuards(AuthGuard)
  async approveReschedule(
    @Param('id') id: string,
    @GetUser() user: JWTUserInterface,
  ) {
    const booking = await this.bookingsService.approveReschedule(id, user);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  @Patch(':id/reschedule/reject')
  @UseGuards(AuthGuard)
  async rejectReschedule(
    @Param('id') id: string,
    @GetUser() user: JWTUserInterface,
  ) {
    const booking = await this.bookingsService.rejectReschedule(id, user);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }
}
