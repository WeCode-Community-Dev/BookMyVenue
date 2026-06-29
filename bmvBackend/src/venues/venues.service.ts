import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, Not, Between } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { VenueImage } from './entities/venue-image.entity';
import { VenueDocument } from './entities/venue-document.entity';
import { VenueVerificationRequest } from './entities/venue-verification-request.entity';
import { VenueBlockedDate } from './entities/venue-blocked-date.entity';
import { VenueStatus } from '../common/enums/venue-status.enum';
import { VerificationStatus } from '../common/enums/verification-status.enum';
import { ImageType } from '../common/enums/image-type.enum';
import { DocumentType } from '../common/enums/document-type.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueInfoDto } from './dto/update-venue-info.dto';
import { PublicVenuesFilterDto } from './dto/public-venues-filter.dto';
import { PublicVenueResponseDto } from './dto/public-list-dto';
import { PublicVenueDetailResponseDto } from './dto/public-list-dto';
import { CreateVenueBlockedDateRangeDto } from './dto/venue-block.dto';
import { Booking, BookingStatus } from './booking/entities/booking.entity';

/** Minimum / maximum photos required per venue. */
const MIN_PHOTOS_TOTAL = 5;
const MAX_PHOTOS_TOTAL = 20;

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,
    @InjectRepository(VenueImage)
    private readonly imageRepo: Repository<VenueImage>,
    @InjectRepository(VenueDocument)
    private readonly documentRepo: Repository<VenueDocument>,
    @InjectRepository(VenueVerificationRequest)
    private readonly verificationRepo: Repository<VenueVerificationRequest>,
    @InjectRepository(VenueBlockedDate)
    private readonly VenueBlockedRepo: Repository<VenueBlockedDate>,
    @InjectRepository(Booking)
    private readonly BookingRepo: Repository<Booking>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) { }

  // ═══════════════════════════════════════════════════════════════════════════
  // Step 2 — Venue Basic Info
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Creates a new venue record for the authenticated owner.
   * Sets step_venue_info_done = true immediately.
   * An owner can have only one venue in DRAFT/PENDING at a time.
   */
  async createVenue(dto: CreateVenueDto, ownerId: string): Promise<Venue> {
    // Prevent duplicate active venues per owner
    const existing = await this.venueRepo.findOne({ where: { ownerId } });
    if (existing) {
      throw new ConflictException(
        'You already have a venue registered. Please manage your existing venue.',
      );
    }

    const venue = this.venueRepo.create({
      ...dto,
      ownerId,
      status: VenueStatus.DRAFT,
      stepVenueInfoDone: true,
    });

    return this.venueRepo.save(venue);
  }

  /**
   * Updates venue basic info.
   * Blocked when status = PENDING_REVIEW (must wait for admin decision).
   */
  async updateVenueInfo(venue: Venue, dto: UpdateVenueInfoDto): Promise<Venue> {
    if (venue.status === VenueStatus.PENDING_REVIEW || venue.status === VenueStatus.RESUBMITTED) {
      throw new ForbiddenException(
        'Venue is currently under review. You cannot edit it until the admin review is complete.',
      );
    }

    Object.assign(venue, dto);
    venue.stepVenueInfoDone = true;
    return this.venueRepo.save(venue);
  }

  /** Returns the venue owned by the authenticated user. */
  async getMyVenue(ownerId: string): Promise<Venue> {
    const venue = await this.venueRepo.findOne({ where: { ownerId } });
    if (!venue) {
      throw new NotFoundException('No venue found for your account.');
    }

    // Fetch latest verification request to append its review notes
    const lastRequest = await this.verificationRepo.findOne({
      where: { venueId: venue.id },
      order: { submissionNumber: 'DESC' },
    });
    (venue as any).reviewNotes = lastRequest?.reviewNotes || null;

    return venue;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Step 3 — Venue Photos
  // ═══════════════════════════════════════════════════════════════════════════

  async getImages(venueId: string): Promise<VenueImage[]> {
    return this.imageRepo.find({
      where: { venueId },
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  /**
   * Uploads an image file to Cloudinary and saves the record.
   * Accepts a Multer file buffer directly (multipart/form-data).
   */
  async addImage(
    venue: Venue,
    file: Express.Multer.File,
    imageType: ImageType,
    displayOrder: number | undefined,
    uploaderId: string,
  ): Promise<VenueImage> {
    if (!file) {
      throw new BadRequestException('No file provided. Please upload an image.');
    }
    if (!imageType || !Object.values(ImageType).includes(imageType)) {
      throw new BadRequestException(
        `imageType must be one of: ${Object.values(ImageType).join(', ')}`,
      );
    }

    // Total image cap
    const currentCount = await this.imageRepo.count({
      where: { venueId: venue.id },
    });
    if (currentCount >= MAX_PHOTOS_TOTAL) {
      throw new BadRequestException(
        `Maximum ${MAX_PHOTOS_TOTAL} images allowed per venue.`,
      );
    }

    // Upload to Cloudinary
    const { publicId, secureUrl } = await this.cloudinaryService.uploadImage(
      file.buffer,
      venue.id,
    );

    // Persist record — fileKey holds the Cloudinary public_id for future deletion
    const image = await this.imageRepo.save(
      this.imageRepo.create({
        venueId: venue.id,
        imageUrl: secureUrl,
        fileKey: publicId,
        imageType,
        displayOrder: displayOrder ?? currentCount,
      }),
    );

    // Recompute step completion
    await this.recomputePhotoStep(venue);

    return image;
  }

  async deleteImage(
    venue: Venue,
    imageId: string,
  ): Promise<{ message: string }> {
    const image = await this.imageRepo.findOne({
      where: { id: imageId, venueId: venue.id },
    });
    if (!image) {
      throw new NotFoundException('Image not found.');
    }

    // Delete from Cloudinary
    await this.cloudinaryService.deleteImage(image.fileKey);

    await this.imageRepo.delete(imageId);

    // Recompute step completion
    await this.recomputePhotoStep(venue);

    return { message: 'Image deleted successfully.' };
  }

  /**
   * Recomputes step_photos_done based on current image coverage.
   *
   * Rules:
   *   - At least 1 COVER image
   *   - At least 1 ENTRANCE image
   *   - At least 1 HALL image
   *   - At least 1 PARKING image IF venue.has_parking = true
   *   - Total >= 5 images
   */
  private async recomputePhotoStep(venue: Venue): Promise<void> {
    const images = await this.imageRepo.find({ where: { venueId: venue.id } });

    const byType = (type: ImageType) =>
      images.filter((i) => i.imageType === type).length;

    const hasMinimum =
      byType(ImageType.COVER) >= 1 &&
      byType(ImageType.ENTRANCE) >= 1 &&
      byType(ImageType.HALL) >= 1 &&
      (!venue.hasParking || byType(ImageType.PARKING) >= 1) &&
      images.length >= MIN_PHOTOS_TOTAL;

    await this.venueRepo.update(venue.id, { stepPhotosDone: hasMinimum });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Step 5 — Verification Documents
  // ═══════════════════════════════════════════════════════════════════════════

  async getDocuments(
    venueId: string,
  ): Promise<Omit<VenueDocument, 'documentUrl'>[]> {
    const docs = await this.documentRepo.find({ where: { venueId } });
    // Strip the actual URL — only show type + status to the owner for listing
    return docs.map(({ documentUrl: _url, ...rest }) => rest);
  }

  /**
   * Uploads a document file to Cloudinary and saves the record.
   * Accepts a Multer file buffer directly (multipart/form-data).
   */
  async addDocument(
    venue: Venue,
    file: Express.Multer.File,
    documentType: DocumentType,
    uploaderId: string,
  ): Promise<Omit<VenueDocument, 'documentUrl'>> {
    if (!file) {
      throw new BadRequestException(
        'No file provided. Please upload a document.',
      );
    }
    if (!documentType || !Object.values(DocumentType).includes(documentType)) {
      throw new BadRequestException(
        `documentType must be one of: ${Object.values(DocumentType).join(', ')}`,
      );
    }

    // Upload to Cloudinary (raw resource type for PDFs / non-image files)
    const { publicId, secureUrl } = await this.cloudinaryService.uploadDocument(
      file.buffer,
      venue.id,
    );

    const doc = await this.documentRepo.save(
      this.documentRepo.create({
        venueId: venue.id,
        documentType,
        documentUrl: secureUrl,
        fileKey: publicId, // Cloudinary public_id stored for deletion
      }),
    );

    // Any document uploaded = step done
    await this.venueRepo.update(venue.id, { stepDocumentsDone: true });

    const { documentUrl: _url, ...rest } = doc;
    return rest;
  }

  async deleteDocument(
    venue: Venue,
    documentId: string,
  ): Promise<{ message: string }> {
    const doc = await this.documentRepo.findOne({
      where: { id: documentId, venueId: venue.id },
    });
    if (!doc) {
      throw new NotFoundException('Document not found.');
    }

    // Delete from Cloudinary
    await this.cloudinaryService.deleteDocument(doc.fileKey);

    await this.documentRepo.delete(documentId);

    // Recompute: if no docs remain, step is incomplete
    const remaining = await this.documentRepo.count({
      where: { venueId: venue.id },
    });
    await this.venueRepo.update(venue.id, {
      stepDocumentsDone: remaining > 0,
    });

    return { message: 'Document deleted successfully.' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Step 6 — Onboarding Status & Submit
  // ═══════════════════════════════════════════════════════════════════════════

  /** Returns full onboarding progress + submission history. */
  async getOnboardingStatus(venue: Venue) {
    const images = await this.imageRepo.find({ where: { venueId: venue.id } });

    const documents = await this.documentRepo.count({
      where: { venueId: venue.id },
    });
    const history = await this.verificationRepo.find({
      where: { venueId: venue.id },
      order: { submissionNumber: 'DESC' },
      select: [
        'id',
        'submissionNumber',
        'status',
        'reviewNotes',
        'submittedAt',
        'reviewedAt',
      ],
    });

    // Reload fresh venue for up-to-date step flags
    const fresh = await this.venueRepo.findOneOrFail({
      where: { id: venue.id },
    });

    const canSubmit =
      fresh.stepVenueInfoDone &&
      fresh.stepPhotosDone &&
      fresh.stepDocumentsDone &&
      (fresh.status === VenueStatus.DRAFT ||
        fresh.status === VenueStatus.CHANGES_REQUESTED);

    return {
      venueId: fresh.id,
      venueName: fresh.venueName,
      status: fresh.status,
      steps: {
        venueInfo: { done: fresh.stepVenueInfoDone },
        photos: {
          done: fresh.stepPhotosDone,
          uploaded: images.length,
          required: MIN_PHOTOS_TOTAL,
        },
        documents: { done: fresh.stepDocumentsDone, count: documents },
      },
      canSubmit,
      submissionHistory: history,
    };
  }

  /**
   * Submits the venue for admin verification.
   *
   * Rules:
   *   - All 4 onboarding steps must be complete.
   *   - Venue status must be DRAFT or CHANGES_REQUESTED.
   *   - No existing PENDING submission for this venue.
   *   - REJECTED venues cannot re-submit (terminal).
   */
  async submitForVerification(
    venue: Venue,
    submittedBy: string,
  ): Promise<{ message: string; submissionNumber: number; status: string }> {
    // Block REJECTED venues
    if (venue.status === VenueStatus.REJECTED) {
      throw new ForbiddenException(
        'This venue has been rejected. Please contact support to appeal.',
      );
    }

    // Must be in a submittable state
    if (
      venue.status !== VenueStatus.DRAFT &&
      venue.status !== VenueStatus.CHANGES_REQUESTED
    ) {
      throw new BadRequestException(
        `Cannot submit a venue with status "${venue.status}".`,
      );
    }

    // All steps must be done
    if (
      !venue.stepVenueInfoDone ||
      !venue.stepPhotosDone ||
      !venue.stepDocumentsDone
    ) {
      throw new BadRequestException(
        'Please complete all onboarding steps before submitting.',
      );
    }

    // Check for duplicate pending submission
    const pending = await this.verificationRepo.findOne({
      where: { venueId: venue.id, status: VerificationStatus.PENDING },
    });
    if (pending) {
      throw new ConflictException(
        'A verification request is already pending for this venue.',
      );
    }

    // Calculate next submission number
    const lastRequest = await this.verificationRepo.findOne({
      where: { venueId: venue.id },
      order: { submissionNumber: 'DESC' },
    });
    const submissionNumber = (lastRequest?.submissionNumber ?? 0) + 1;

    const nextStatus =
      venue.status === VenueStatus.CHANGES_REQUESTED
        ? VenueStatus.RESUBMITTED
        : VenueStatus.PENDING_REVIEW;

    // Update venue status + create new request row in a transaction
    await this.dataSource.transaction(async (manager) => {
      await manager.update(Venue, venue.id, {
        status: nextStatus,
      });
      await manager.save(
        manager.create(VenueVerificationRequest, {
          venueId: venue.id,
          submittedBy,
          submissionNumber,
          status: VerificationStatus.PENDING,
        }),
      );
    });

    return {
      message: 'Venue submitted for verification successfully.',
      submissionNumber,
      status: nextStatus,
    };
  }

  /**
   * Find all public venues that are APPROVED.
   * Supports pagination and filtering by city, type, capacity, and keyword search.
   */
  async findPublicVenues(
    filters: PublicVenuesFilterDto,
  ): Promise<{ data: PublicVenueResponseDto[]; total: number; page: number; limit: number }> {
    const { city, venueType, maxCapacity, search, date, page = 1, limit = 10 } = filters;

    const query = this.venueRepo.createQueryBuilder('venue')
      .leftJoinAndSelect('venue.images', 'image')
      .where('venue.status = :status', { status: VenueStatus.APPROVED });


    if (city) {
      query.andWhere('LOWER(venue.city) = LOWER(:city)', { city });
    }

    if (venueType) {
      query.andWhere('venue.venueType = :venueType', { venueType });
    }

    if (maxCapacity) {
      query.andWhere('venue.maxCapacity >= :maxCapacity', { maxCapacity });
    }

    if (search) {
      query.andWhere(
        '(LOWER(venue.venueName) LIKE LOWER(:search) OR LOWER(venue.description) LIKE LOWER(:search) OR LOWER(venue.city) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Exclude venues that are already booked on the requested date
    if (date) {
      query.andWhere(`venue.id NOT IN (
        SELECT b.venue_id FROM bookings b
        WHERE b.booking_date = :date
        AND b.booking_status IN ('PENDING_PAYMENT', 'CONFIRMED')
      )`, { date });

      // Exclude venues that are blocked (range covers the requested date)
      query.andWhere(`venue.id NOT IN (
        SELECT vbd.venue_id FROM venue_blocked_dates vbd
        WHERE :date BETWEEN vbd.start_date AND vbd.end_date
      )`, { date });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);
    query.orderBy('venue.createdAt', 'DESC');

    const [venues, total] = await query.getManyAndCount();

    const data: PublicVenueResponseDto[] = venues.map((venue) => ({
      id: venue.id,
      venueName: venue.venueName,
      city: venue.city,
      venueType: venue.venueType,
      maxCapacity: venue.maxCapacity,
      startingPrice: venue.startingPrice,
      thumbnailImage: venue.images?.[0]?.imageUrl ?? null,
    }));

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Find full details of a specific approved venue.
   */
  async findPublicVenueDetail(id: string): Promise<PublicVenueDetailResponseDto> {
    const venue = await this.venueRepo.findOne({
      where: { id, status: VenueStatus.APPROVED },
      relations: ['images'],
    });

    if (!venue) {
      throw new NotFoundException('Venue not found or not approved.');
    }
    const {
      ownerId,
      stepVenueInfoDone,
      stepPhotosDone,
      stepFacilitiesDone,
      stepDocumentsDone,
      ...venueData
    } = venue;

    return venueData;
  }

  /**
   * Blocks a date range on a venue.
   * Only the venue owner is authorized.
   * Validates date logic and checks for conflicting active bookings.
   */
  async venueBlocking(
    dto: CreateVenueBlockedDateRangeDto,
    userId: string,
    userRole: UserRole,
    venueId: string,
  ): Promise<VenueBlockedDate> {
    const { startDate, endDate, reason } = dto;

    // 1. Fetch and validate venue
    const venue = await this.venueRepo.findOne({ where: { id: venueId } });

    if (!venue) {
      throw new NotFoundException('The venue is not found');
    }

    // 2. Authorization: only the owner of this venue can block it
    if (venue.ownerId !== userId) {
      throw new ForbiddenException('You are not authorized to block this venue.');
    }

    // 3. Date Validations
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // endDate must not be before startDate
    if (end < start) {
      throw new BadRequestException('End date cannot be before start date.');
    }

    // startDate must be at least yesterday or later (not in the distant past)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (start < yesterday) {
      throw new BadRequestException('Start date cannot be older than yesterday.');
    }

    // 4. Check for conflicting active bookings within this range
    const conflictingBooking = await this.BookingRepo.findOne({
      where: {
        venueId,
        bookingStatus: Not(BookingStatus.CANCELLED),
        bookingDate: Between(startDate, endDate),
      },
    });

    if (conflictingBooking) {
      throw new ConflictException(
        `Cannot block this range. There is an active booking on ${conflictingBooking.bookingDate}.`,
      );
    }

    // 5. Create and save the block range
    const blockedRange = this.VenueBlockedRepo.create({
      venueId,
      startDate,
      endDate,
      reason: reason || null,
    });

    return await this.VenueBlockedRepo.save(blockedRange);
  }

  /**
   * Get all blocked date ranges for a venue.
   */
  async getBlockedDates(venueId: string): Promise<VenueBlockedDate[]> {
    return this.VenueBlockedRepo.find({
      where: { venueId },
      order: { startDate: 'ASC' },
    });
  }

  /**
   * Delete a blocked date range.
   */
  async deleteBlockedDate(venueId: string, blockId: string): Promise<{ message: string }> {
    const block = await this.VenueBlockedRepo.findOne({
      where: { id: blockId, venueId }
    });
    if (!block) {
      throw new NotFoundException('Blocked date range not found.');
    }
    await this.VenueBlockedRepo.remove(block);
    return { message: 'Date range unblocked successfully.' };
  }

  /**
   * Get dashboard statistics for the owner's venue.
   */
  async getMyVenueStats(ownerId: string): Promise<any> {
    const venue = await this.venueRepo.findOne({
      where: { ownerId }
    });
    if (!venue) {
      throw new NotFoundException('Venue not found for this partner.');
    }

    const bookings = await this.BookingRepo.find({
      where: { venueId: venue.id }
    });

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
    const cancelledBookings = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;
    
    // Sum of paid amount
    const grossEarnings = bookings
      .filter(b => b.paymentStatus === 'PAID' && b.bookingStatus !== 'CANCELLED')
      .reduce((sum, b) => sum + Number(b.totalAmount), 0);

    return {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      grossEarnings,
      averageRating: 4.8, // static rating since reviews are not modeled yet
    };
  }

  /**
   * Check if a venue is available on a specific date.
   * Walks through booking dates and blocked dates.
   */
  async checkAvailability(venueId: string, dateStr: string): Promise<{ available: boolean; reason?: string }> {
    if (!dateStr) {
      throw new BadRequestException('Date query parameter is required.');
    }

    // 1. Walk through bookings
    // Check if there is any booking for this venue on the given date
    // that is CONFIRMED or PENDING_PAYMENT.
    const activeBooking = await this.BookingRepo.findOne({
      where: {
        venueId,
        bookingDate: dateStr,
        bookingStatus: In([BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT]),
      },
    });

    if (activeBooking) {
      return { available: false, reason: 'ALREADY_BOOKED' };
    }

    // 2. Walk through blocked dates
    // Find if the date falls within any blocked date range
    const blockedDate = await this.VenueBlockedRepo.createQueryBuilder('blocked')
      .where('blocked.venueId = :venueId', { venueId })
      .andWhere('blocked.startDate <= :dateStr', { dateStr })
      .andWhere('blocked.endDate >= :dateStr', { dateStr })
      .getOne();

    if (blockedDate) {
      return { available: false, reason: blockedDate.reason || 'BLOCKED' };
    }

    return { available: true };
  }
}
