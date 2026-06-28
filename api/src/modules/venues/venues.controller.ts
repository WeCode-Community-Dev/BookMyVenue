import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Headers,
  Put,
} from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenuesService } from './venues.service';
import { CreateImagesDto } from './dto/create-images.dto';
import { CreateSpaceOperatingHoursDto } from './dto/create-space-op-hours.dto';
import { CreateSpaceBlockedPeriodDto } from './dto/create-space-block-period.dto';
import { UpdateSpaceBlockedPeriodDto } from './dto/update-space-block-period.dto';

@Controller()
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post('venues')
  createVenue(@Body() dto: CreateVenueDto, @Headers('authorization') authorization: string) {
    return this.venuesService.createVenue(dto, authorization);
  }

  @Get('venues/owned')
  getOwnedVenues(@Headers('authorization') authorization: string) {
    return this.venuesService.getOwnedVenues(authorization);
  }

  @Get('venues')
  findAllVenues() {
    return this.venuesService.findAllVenues();
  }

  @Get('venues/:id')
  findOneVenue(@Param('id', ParseUUIDPipe) id: string) {
    return this.venuesService.findOneVenue(id);
  }

  @Patch('venues/:id')
  updateVenue(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateVenueDto) {
    return this.venuesService.updateVenue(id, dto);
  }

  @Delete('venues/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVenue(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.venuesService.removeVenue(id);
  }

  @Post('venues/:venueId/spaces')
  createSpace(
    @Param('venueId', ParseUUIDPipe) venueId: string,
    @Body() dto: CreateSpaceDto,
  ) {
    return this.venuesService.createSpace(venueId, dto);
  }

  @Get('venues/:venueId/spaces')
  findSpacesByVenue(@Param('venueId', ParseUUIDPipe) venueId: string) {
    return this.venuesService.findSpacesByVenue(venueId);
  }

  @Get('spaces/:id')
  findOneSpace(@Param('id', ParseUUIDPipe) id: string) {
    return this.venuesService.findOneSpace(id);
  }

  @Patch('spaces/:id')
  updateSpace(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSpaceDto) {
    return this.venuesService.updateSpace(id, dto);
  }

  @Delete('spaces/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSpace(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.venuesService.removeSpace(id);
  }

  @Get('amenities')
  findAllAmenities() {
    return this.venuesService.findAllAmenities();
  }

  @Post('images')
  createImages(@Body() dto: CreateImagesDto) {
    return this.venuesService.createImages(dto);
  }

  @Get('space-categories')
  getAllSpaceCategories() {
    return this.venuesService.getAllSpaceCategories();
  }

  @Get('capacity-types')
  getCapacityTypes() {
    return this.venuesService.getCapacityTypes();
  }

  @Post('spaces/:spaceId/operating-hours')
  createSpaceOperatingHours(@Param('spaceId', ParseUUIDPipe) spaceId: string, @Body() dto: CreateSpaceOperatingHoursDto) {
    return this.venuesService.createSpaceOperatingHours(spaceId, dto);
  }

  @Get('spaces/:spaceId/operating-hours')
  getSpaceOperatingHours(@Param('spaceId', ParseUUIDPipe) spaceId: string) {
    return this.venuesService.getSpaceOperatingHours(spaceId);
  }

  @Post('spaces/:spaceId/blocked-periods')
  createSpaceBlockedPeriods(@Param('spaceId', ParseUUIDPipe) spaceId: string, @Body() dto: CreateSpaceBlockedPeriodDto) {
    return this.venuesService.createSpaceBlockedPeriods(spaceId, dto);
  }
  @Get('spaces/:spaceId/blocked-periods')
  getSpaceBlockedPeriods(@Param('spaceId', ParseUUIDPipe) spaceId: string) {
    return this.venuesService.getSpaceBlockedPeriods(spaceId);
  }

  @Put('spaces/:spaceId/blocked-periods/:id')
  updateSpaceBlockedPeriods(@Param('spaceId', ParseUUIDPipe) spaceId: string, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSpaceBlockedPeriodDto) {
    return this.venuesService.updateSpaceBlockedPeriods(spaceId, id, dto);
  }

  @Delete('spaces/:spaceId/blocked-periods/:id')
  removeSpaceBlockedPeriod(@Param('spaceId', ParseUUIDPipe) spaceId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.venuesService.removeSpaceBlockedPeriod(spaceId, id);
  }

}
