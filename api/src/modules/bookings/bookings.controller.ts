import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @Body() dto: CreateBookingDto,
    @Headers('authorization') authorization: string,
  ) {
    return this.bookingsService.create(dto, authorization);
  }

  @Get()
  findAll(@Headers('authorization') authorization: string) {
    return this.bookingsService.findAllForUser(authorization);
  }

  @Get('spaces/:spaceId/occupancy')
  getSpaceOccupancy(@Param('spaceId', ParseUUIDPipe) spaceId: string) {
    return this.bookingsService.getSpaceOccupancy(spaceId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('authorization') _authorization: string,
  ) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('authorization') _authorization: string,
  ) {
    return this.bookingsService.cancel(id);
  }
}
