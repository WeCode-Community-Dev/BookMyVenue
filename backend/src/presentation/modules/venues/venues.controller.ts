import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, UseInterceptors, ParseUUIDPipe, UploadedFiles } from '@nestjs/common';
import { CreateVenueCommand } from '../../../core/application/venues/commands/create-venue.command';
import { SearchVenuesQuery } from '../../../core/application/venues/queries/search-venues.query';
import { GetVenueDetailsQuery } from '../../../core/application/venues/queries/get-venue-details.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { type TokenPayload } from '../../../core/application/users/services/token.interface';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { createVenueSchema } from '../../validation/venues/create-venue.schema';
import { CreateVenueDto } from './dto/create-venue.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FindMyVenuesQuery } from 'src/core/application/venues/queries/find-my-venues.query';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import { UserRole } from 'src/core/domain/_shared/enum/UserRole';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadVenueImagesCommand } from 'src/core/application/venues/commands/upload-venue-images.command';
import { Express } from 'express'

@ApiTags('venues')
@Controller({
  version: '1',
  path: 'venues',
})
@ApiBearerAuth('JWT-auth')
export class VenuesController {
  constructor(
    private readonly createVenueCommand: CreateVenueCommand,
    private readonly searchVenuesQuery: SearchVenuesQuery,
    private readonly getVenueDetailsQuery: GetVenueDetailsQuery,
    private readonly findMyVenuesQuery: FindMyVenuesQuery,
    private readonly uploadVenueImageCommand: UploadVenueImagesCommand
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new venue' })
  @ApiResponse({ status: 201, description: 'Venue created successfully' })
  create(
    @CurrentUser() user: TokenPayload,
    @Body(new ZodValidationPipe(createVenueSchema as any)) data: CreateVenueDto,
  ) {
    return this.createVenueCommand.execute({
      ownerId: user.userId,
      ...data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter venues' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'venueType', required: false })
  @ApiQuery({ name: 'capacity', required: false, type: Number })
  findAll(
    @Query('city') city?: string,
    @Query('venueType') venueType?: string,
    @Query('capacity') capacity?: string,
  ) {
    return this.searchVenuesQuery.execute({
      city,
      venueType,
      capacity: capacity ? parseInt(capacity, 10) : undefined,
    });
  }

  @Post(':venueId/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
    ),
  )
  @ApiOperation({ summary: 'Venue images upload api' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadVenueImages(
    @Param('venueId', ParseUUIDPipe,) venueId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: TokenPayload
  ) {

    return this.uploadVenueImageCommand.execute({
      ownerId: user.userId,
      venueId,
      files: files.map(file => ({
        buffer: file.buffer,
        fileName: file.originalname
      }))
    })
  }

  @Get('my-venues')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENUE_OWNER)
  @ApiOperation({ summary: 'Get the list of all venues created by owner' })
  findMyVenues(@CurrentUser() user: TokenPayload) {
    return this.findMyVenuesQuery.execute(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific venue by ID' })
  @ApiResponse({ status: 200, description: 'Venue found' })
  @ApiResponse({ status: 404, description: 'Venue not found' })
  findOne(@Param('id') id: string) {
    return this.getVenueDetailsQuery.execute(id);
  }

}
