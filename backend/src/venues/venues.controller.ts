import { Controller, Get, Param, Post, Put, Delete, Body, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { GetUser } from '../users/decorators/get-user.decorator';
import type { JWTUserInterface } from '../interface/jwt-user.interface';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENUE_OWNER)
  async create(@Body() createVenueDto: CreateVenueDto, @GetUser() user: JWTUserInterface) {
    return this.venuesService.create(createVenueDto, user.id.toString());
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.venuesService.findAll(search);
  }

  @Get('my')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  async findMyVenues(
    @GetUser() user: JWTUserInterface,
  ) {
    return this.venuesService.findByOwnerId(
      user.id,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const venue = await this.venuesService.findById(id);
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENUE_OWNER)
  async update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @GetUser() user: JWTUserInterface,
  ) {
    const venue = await this.venuesService.update(id, updateVenueDto, user.id.toString(), user.role);
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENUE_OWNER)
  async remove(
    @Param('id') id: string,
    @GetUser() user: JWTUserInterface,
  ) {
    const result = await this.venuesService.remove(id, user.id.toString(), user.role);
    if (!result) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return { success: true };
  }
}
