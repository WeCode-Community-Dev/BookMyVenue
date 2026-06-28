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
} from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenuesService } from './venues.service';
import { CreateImagesDto } from './dto/create-images.dto';

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

}
