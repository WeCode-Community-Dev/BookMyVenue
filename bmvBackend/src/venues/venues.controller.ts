import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { VenueOwnerGuard } from '../common/guards/venue-owner.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

import { UserRole } from '../common/enums/user-role.enum';
import { VenuesService } from './venues.service';
import { Venue } from './entities/venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueInfoDto } from './dto/update-venue-info.dto';
import { ImageType } from '../common/enums/image-type.enum';
import { DocumentType } from '../common/enums/document-type.enum';
import { CreateVenueBlockedDateRangeDto } from './dto/venue-block.dto';

/** Helper to get the pre-loaded venue from request (attached by VenueOwnerGuard). */
function getVenue(req: any): Venue {
  return req.venue as Venue;
}

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) { }

  // ─── Step 2: Venue Basic Info ──────────────────────────────────────────────

  /**
   * POST /venues
   * Create a new venue. Owner can only have one venue.
   */
  @Post('venues')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.VENUE_OWNER)
  createVenue(
    @Body() dto: CreateVenueDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.venuesService.createVenue(dto, user.sub);
  }

  /**
   * GET /venues/my-venue
   * Get the authenticated owner's venue.
   */
  @Get('venues/my-venue')
  @Roles(UserRole.VENUE_OWNER)
  getMyVenue(@CurrentUser() user: CurrentUserPayload) {
    return this.venuesService.getMyVenue(user.sub);
  }

  /**
   * PATCH /venues/:venueId/info
   * Update venue basic info. Blocked while PENDING_REVIEW.
   */
  @Patch('venues/:venueId/info')
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  updateVenueInfo(@Req() req: any, @Body() dto: UpdateVenueInfoDto) {
    return this.venuesService.updateVenueInfo(getVenue(req), dto);
  }

  // ─── Step 3: Photos ────────────────────────────────────────────────────────

  /**
   * GET /venues/:venueId/images
   * List all images for a venue.
   */
  @Get('venues/:venueId/images')
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  getImages(@Param('venueId', ParseUUIDPipe) venueId: string) {
    return this.venuesService.getImages(venueId);
  }

  /**
   * POST /venues/:venueId/images
   * Upload an image file directly — multipart/form-data.
   * Fields: file (required), imageType (required), displayOrder (optional).
   */
  @Post('venues/:venueId/images')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('imageType') imageType: ImageType,
    @Body('displayOrder') displayOrder: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.venuesService.addImage(
      getVenue(req),
      file,
      imageType,
      displayOrder ? parseInt(displayOrder, 10) : undefined,
      user.sub,
    );
  }

  /**
   * DELETE /venues/:venueId/images/:imageId
   * Remove an image from the venue and delete it from Cloudinary.
   */
  @Delete('venues/:venueId/images/:imageId')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  deleteImage(
    @Req() req: any,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.venuesService.deleteImage(getVenue(req), imageId);
  }

  // ─── Step 4: Facilities ────────────────────────────────────────────────────

  /**
   * GET /facilities
   * Public list of all available facilities (for the checklist UI).
   */


  /**
   * GET /venues/:venueId/facilities
   * Get the facilities selected for a specific venue.
   */
  /**
   * PATCH /venues/:venueId/facilities
   * Replace the entire facility selection. Min 1 required.
   */


  // ─── Step 5: Documents ─────────────────────────────────────────────────────

  /**
   * GET /venues/:venueId/documents
   * List documents (URL hidden from listing response).
   */
  @Get('venues/:venueId/documents')
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  getDocuments(@Param('venueId', ParseUUIDPipe) venueId: string) {
    return this.venuesService.getDocuments(venueId);
  }

  /**
   * POST /venues/:venueId/documents
   * Upload a document file directly — multipart/form-data.
   * Fields: file (required), documentType (required).
   */
  @Post('venues/:venueId/documents')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  @UseInterceptors(FileInterceptor('file'))
  addDocument(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: DocumentType,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.venuesService.addDocument(getVenue(req), file, documentType, user.sub);
  }

  /**
   * DELETE /venues/:venueId/documents/:documentId
   * Remove a document and delete it from Cloudinary.
   */
  @Delete('venues/:venueId/documents/:documentId')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  deleteDocument(
    @Req() req: any,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.venuesService.deleteDocument(getVenue(req), documentId);
  }

  // ─── Step 6: Onboarding Status & Submit ───────────────────────────────────

  /**
   * GET /venues/:venueId/onboarding-status
   * Full step progress report + submission history.
   */
  @Get('venues/:venueId/onboarding-status')
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  getOnboardingStatus(@Req() req: any) {
    return this.venuesService.getOnboardingStatus(getVenue(req));
  }

  /**
   * POST /venues/:venueId/submit
   * Submit the venue for admin verification.
   * Requires all 4 steps complete. REJECTED venues are blocked (terminal).
   */
  @Post('venues/:venueId/submit')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.VENUE_OWNER, UserRole.ADMIN)
  @UseGuards(VenueOwnerGuard)
  submitForVerification(
    @Req() req: any,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.venuesService.submitForVerification(getVenue(req), user.sub);
  }

  // ─── Block Venue Dates ─────────────────────────────────────────────────────

  /**
   * POST /booking/venues/:venueId/block
   * Venue owner blocks a date range on their venue.
   * Only the owner of that specific venue can call this.
   */
  @Post('venues/:venueId/block')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.VENUE_OWNER)
  blockVenueDates(
    @Param('venueId', ParseUUIDPipe) venueId: string,
    @Body() dto: CreateVenueBlockedDateRangeDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.venuesService.venueBlocking(dto, user.sub, user.role, venueId);
  }

  /**
   * GET /venues/:venueId/blocked-dates
   * Get all blocked date ranges for a venue.
   */
  @Get('venues/:venueId/blocked-dates')
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  getBlockedDates(@Param('venueId', ParseUUIDPipe) venueId: string) {
    return this.venuesService.getBlockedDates(venueId);
  }

  /**
   * DELETE /venues/:venueId/block/:blockId
   * Unblock a blocked date range.
   */
  @Delete('venues/:venueId/block/:blockId')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.VENUE_OWNER)
  @UseGuards(VenueOwnerGuard)
  deleteBlockedDate(
    @Param('venueId', ParseUUIDPipe) venueId: string,
    @Param('blockId', ParseUUIDPipe) blockId: string,
  ) {
    return this.venuesService.deleteBlockedDate(venueId, blockId);
  }

  /**
   * GET /venues/my-venue/dashboard-stats
   * Get revenue and bookings counts for the owner's venue dashboard.
   */
  @Get('venues/my-venue/dashboard-stats')
  @Roles(UserRole.VENUE_OWNER)
  getMyVenueStats(@CurrentUser() user: CurrentUserPayload) {
    return this.venuesService.getMyVenueStats(user.sub);
  }
}
