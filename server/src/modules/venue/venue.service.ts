import * as repo from './venue.repository';
import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import type {
  CreateVenueData,
  UpdateVenueData,
  AdminVenueFilters,
  IVenue,
  PublicVenueFilters,
} from './venue.types';
import type { IVenueDraft } from './venueDraft.model';
import { requireOwnVenue } from './venue.ownership';
import * as workflow from './venue.workflow';
import { NotFoundError, ConflictError, ValidationError, WorkflowError } from '../../utils/errors';
import type {
  CreateVenueDTO,
  UpdateVenueDTO,
  RejectVenueDTO,
  SuspendVenueDTO,
  AdminVenueFiltersDTO,
} from './venue.validator';
import { VenueFields, ReviewIntent } from '../../constants/venue.constants';
import { VENUE_CONSTANTS } from '../../constants/venue.constants';
import { VenueModel } from './venue.model';
import { RoleModel } from '../../models/role.model';
import { findUserEmailById } from '../user/user.repository';
import * as authRepo from '../auth/auth.repository';
import { getUserRole } from '../../services/roles.service';
import { enqueueEmailTask } from '../../services/email.repository';
import { EmailIntent, EmailTaskStatus } from '../../constants/email.constants';
import mongoose from 'mongoose';
import { logError, logWarn } from '../../utils/logger';
import { BookingModel } from '../booking/models/booking.model';
import { BookingStatus } from '../../constants/booking.constants';

// Google Maps URL Resolution & Transformation

const SHORT_LINK_HOSTS = new Set(['goo.gl', 'maps.app.goo.gl']);

const GOOGLE_MAPS_EMBED_HOSTS = new Set(['maps.google.com', 'www.google.com', 'google.com']);

export async function resolveAndTransformGoogleMapsUrl(
  inputUrl: string | undefined | null
): Promise<string | null> {
  if (!inputUrl) return null;

  try {
    let workingUrl = inputUrl;
    const parsed = new URL(workingUrl);
    if (SHORT_LINK_HOSTS.has(parsed.hostname)) {
      const response = await fetch(workingUrl, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(5_000),
      });
      workingUrl = response.url;
    }

    const resolved = new URL(workingUrl);

    // Step 2: Must be https and a known Google Maps domain
    if (resolved.protocol !== 'https:' || !GOOGLE_MAPS_EMBED_HOSTS.has(resolved.hostname)) {
      return null;
    }

    // Step 3: Already an embed URL — return as-is
    if (resolved.pathname.startsWith('/maps/embed')) {
      return workingUrl;
    }

    // Step 4: Extract a place search query from common share URL patterns
    // Pattern: /maps/place/<name>/@lat,lng,...  or  /maps?q=...
    const qParam = resolved.searchParams.get('q');
    const placeMatch = /\/maps\/place\/([^/]+)/.exec(resolved.pathname);
    const coordMatch = /@(-?\d+\.\d+),(-?\d+\.\d+)/.exec(resolved.pathname);

    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      return `https://maps.google.com/maps?q=${lat},${lng}&output=embed&z=15`;
    }

    if (qParam) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(qParam)}&output=embed&z=15`;
    }

    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1]);
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed&z=15`;
    }

    return null;
  } catch {
    return null;
  }
}

export function sanitizeVenueDto<T extends CreateVenueDTO | UpdateVenueDTO>(
  dto: T,
  currentBookingType?: 'fixedBooking' | 'flexibleBooking'
): T {
  const bookingType = dto.bookingType ?? currentBookingType;
  if (!bookingType) return dto;

  if (bookingType === 'fixedBooking') {
    const {
      flexibleBooking: _fb,
      workingHours: _wh,
      pricing: _pr,
      blockedTimes: _bt,
      ...rest
    } = dto as Record<string, unknown>;
    return rest as T;
  }

  const { fixedPackages: _fp, ...rest } = dto as Record<string, unknown>;
  return rest as T;
}

async function assignOwnerRoleIfNeeded(userId: string): Promise<void> {
  const current = await getUserRole(userId);

  if (current && ['owner', 'admin', 'superAdmin'].includes(current.roleName)) {
    return;
  }

  const ownerRole = await RoleModel.findOne({ name: 'owner', active: true, deleted: false })
    .lean()
    .exec();

  if (!ownerRole) {
    logError('assignOwnerRoleIfNeeded: owner role not found in DB — user not promoted', {
      module: 'venue.service.ts/assignOwnerRoleIfNeeded',
      userId,
    });
    return;
  }

  await authRepo.assignRoleToUser(new mongoose.Types.ObjectId(userId), ownerRole._id);
}

export async function createVenue(userId: string, dto: CreateVenueDTO): Promise<IVenue> {
  // Guard: Check for venue creation ban
  const { isBannedForScope } = await import('../moderation/bannedUser.service.js');
  const isBanned = await isBannedForScope(userId, 'venue_creation');
  if (isBanned) {
    throw new ConflictError('You are currently banned from creating new venues.');
  }

  const nameExists = await repo.existsByOwnerAndName(userId, dto.name);
  if (nameExists) {
    throw new ConflictError(`You already have a venue named "${dto.name}"`);
  }

  const sanitizedDto = sanitizeVenueDto(dto);

  // Resolve and transform the Google Maps URL to a safe embed URL
  const resolvedMapsUrl = await resolveAndTransformGoogleMapsUrl(sanitizedDto.googleMapsUrl);

  const now = new Date();
  const data = {
    ...sanitizedDto,
    googleMapsUrl: resolvedMapsUrl,
    galleryImages: sanitizedDto.galleryImages ?? [],
    ...(sanitizedDto.coordinates && {
      location: { type: 'Point' as const, coordinates: sanitizedDto.coordinates },
    }),
    ownerUserId: userId,
    createdBy: userId,
    updatedBy: userId,
    status: 'PendingReview',
    submissionCount: 1,
    lastSubmittedAt: now,
  } as unknown as CreateVenueData;
  if (!dto.coordinates) delete (data as unknown as Record<string, unknown>).location;
  delete (data as unknown as Record<string, unknown>).coordinates;

  const venue = await repo.createVenue(data);

  await assignOwnerRoleIfNeeded(userId);
  await repo.deleteDraft(userId);

  return venue;
}

export async function getActiveVenues(): Promise<IVenue[]> {
  return repo.findActiveVenues();
}

export async function getPaginatedActiveVenues(
  pagination: PaginationParams,
  filters?: PublicVenueFilters
): Promise<PaginatedResponse<IVenue, 'venues'>> {
  return repo.findPaginatedActiveVenues(pagination, filters);
}

export async function getVenuePins(bbox?: {
  swLng: number;
  swLat: number;
  neLng: number;
  neLat: number;
}): Promise<
  {
    _id: string;
    name: string;
    location: { coordinates: [number, number] };
    coverImage: string;
    avgRating: number;
  }[]
> {
  return repo.findVenuePinsInBounds(bbox);
}

export async function upsertDraft(
  userId: string,
  step: number,
  formValues: Record<string, unknown>
): Promise<IVenueDraft> {
  return repo.upsertDraft(userId, step, formValues);
}

export async function getDraft(userId: string): Promise<IVenueDraft | null> {
  return repo.getDraft(userId);
}

export async function getMyVenues(
  userId: string
): Promise<
  (Pick<
    IVenue,
    | '_id'
    | 'name'
    | 'city'
    | 'district'
    | 'venueType'
    | 'coverImage'
    | 'status'
    | 'rejectionHistory'
    | 'submissionCount'
    | 'currentEditDeadline'
    | 'suspensionReason'
    | 'createdAt'
  > & { rejectionReason?: string; isFeatured?: boolean })[]
> {
  return repo.findMyVenuesProjected(userId);
}

export async function getVenueById(
  venueId: string,
  requesterId?: string,
  isPrivileged?: boolean
): Promise<IVenue> {
  const venue = await repo.findVenueById(venueId);

  if (!venue) {
    throw new NotFoundError('Venue not found');
  }

  const isOwner = requesterId !== undefined && venue.ownerUserId.toString() === requesterId;
  if (venue.status !== 'Approved' && !isPrivileged && !isOwner) {
    throw new NotFoundError('Venue not found');
  }

  return venue;
}

const CRITICAL_FIELDS = new Set([
  'name',
  'contact',
  'address',
  'city',
  'district',
  'pincode',
  'venueType',
  'bookingType',
]);

function buildPatch(
  _venue: IVenue,
  dto: Record<string, unknown>,
  userId: string,
  excludeFields?: string[]
): Record<string, unknown> {
  const patch: Record<string, unknown> = { updatedBy: userId };
  for (const key of VenueFields) {
    if (excludeFields?.includes(key)) continue;
    if (dto[key] !== undefined) {
      patch[key] = dto[key];
    }
  }
  if (dto.coordinates !== undefined) {
    patch.location = { type: 'Point', coordinates: dto.coordinates };
  }
  return patch;
}

export async function updateVenue(
  venueId: string,
  userId: string,
  dto: UpdateVenueDTO
): Promise<IVenue> {
  const venue = await requireOwnVenue(venueId, userId);

  // Optimistic concurrency check
  if (dto.expectedVersion !== undefined && venue.__v !== dto.expectedVersion) {
    throw new ConflictError(
      'Venue has been modified by another request. Please reload and try again.'
    );
  }

  if (dto.name && dto.name !== venue.name) {
    const nameExists = await repo.existsByOwnerAndName(userId, dto.name, venueId);
    if (nameExists) {
      throw new ConflictError(`You already have a venue named "${dto.name}"`);
    }
  }

  const sanitizedDto = sanitizeVenueDto(dto, venue.bookingType);

  // Resolve and transform the Google Maps URL to a safe embed URL if provided
  if (sanitizedDto.googleMapsUrl !== undefined) {
    sanitizedDto.googleMapsUrl =
      (await resolveAndTransformGoogleMapsUrl(sanitizedDto.googleMapsUrl)) ?? undefined;
  }

  // Status-gated dispatch
  if (venue.status === 'Draft' || venue.status === 'Rejected') {
    const patch = buildPatch(venue, sanitizedDto, userId);
    const updated = await repo.updateVenue(venueId, patch as unknown as UpdateVenueData);
    if (!updated) throw new NotFoundError('Venue not found');
    return updated;
  }

  if (venue.status === 'Approved' || venue.status === 'Inactive') {
    const dtoAny = sanitizedDto as unknown as Record<string, unknown>;
    const venueAny = venue as unknown as Record<string, unknown>;
    const changedCritical: string[] = [];
    const snapshot: Record<string, unknown> = {};

    for (const field of CRITICAL_FIELDS) {
      if (dtoAny[field] !== undefined && dtoAny[field] !== venueAny[field]) {
        changedCritical.push(field);
        snapshot[field] = venueAny[field];
      }
    }

    if (changedCritical.length > 0) {
      // Apply all fields immediately (Option B — snapshot is for rollback on reject)
      const patch = buildPatch(venue, dtoAny, userId);
      const updated = await repo.updateVenue(venueId, patch as UpdateVenueData);
      if (!updated) throw new NotFoundError('Venue not found');

      // Mark pending review with snapshot
      await VenueModel.findByIdAndUpdate(venueId, {
        $set: {
          'pendingReview.intent': ReviewIntent.VENUE_EDIT,
          'pendingReview.requestedAt': new Date(),
          'pendingReview.details.changedFields': changedCritical,
          'pendingReview.details.previousSnapshot': snapshot,
        },
      }).exec();

      // Re-fetch to include pendingReview
      const withReview = await repo.findVenueById(venueId);
      if (!withReview) throw new NotFoundError('Venue not found');
      return withReview;
    }

    // Only non-critical fields — apply full patch immediately
    const patch = buildPatch(venue, dtoAny, userId);
    const updated = await repo.updateVenue(venueId, patch as unknown as UpdateVenueData);
    if (!updated) throw new NotFoundError('Venue not found');
    return updated;
  }

  throw new WorkflowError(venue.status, 'edit');
}

export async function deleteVenue(venueId: string, userId: string): Promise<void> {
  const venue = await requireOwnVenue(venueId, userId);
  workflow.canDelete(venue);
  await repo.softDeleteVenue(venueId, userId);
}

export async function submitVenue(venueId: string, userId: string): Promise<IVenue> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const venue = await repo.findVenueById(venueId, session);
    if (!venue) throw new NotFoundError('Venue not found');

    // Ownership check
    if (venue.ownerUserId.toString() !== userId) {
      throw new ConflictError('Not authorized to submit this venue');
    }

    // Status must be Rejected
    if (venue.status !== 'Rejected') {
      throw new ValidationError('Only rejected venues can be resubmitted');
    }

    // Check max attempts
    if (venue.submissionCount >= VENUE_CONSTANTS.MAX_SUBMISSION_ATTEMPTS) {
      throw new ValidationError(
        `Maximum submission attempts (${String(VENUE_CONSTANTS.MAX_SUBMISSION_ATTEMPTS)}) exceeded`
      );
    }

    // Check edit deadline (race condition protection)
    const now = new Date();
    if (venue.currentEditDeadline && venue.currentEditDeadline < now) {
      throw new ValidationError('Edit window expired. Venue has been auto-suspended.');
    }

    // Validate all required fields present
    workflow.canSubmit(venue);

    // Atomic update: Rejected -> PendingReview, clear deadline, increment count
    const updated = await VenueModel.findByIdAndUpdate(
      venueId,
      {
        $set: {
          status: 'PendingReview',
          currentEditDeadline: null,
          updatedBy: new mongoose.Types.ObjectId(userId),
          lastSubmittedAt: now,
        },
        $inc: { submissionCount: 1 },
      },
      { new: true, session }
    ).exec();

    if (!updated) throw new NotFoundError('Venue not found');

    await session.commitTransaction();
    return updated;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
}

// Admin Operations

export async function getPendingVenues(): Promise<IVenue[]> {
  return repo.findPendingVenues();
}

export async function getAllVenues(
  filters: AdminVenueFiltersDTO
): Promise<PaginatedResponse<IVenue, 'venues'>> {
  const repoFilters: AdminVenueFilters = {
    status: filters.status,
    city: filters.city,
    page: filters.page,
    limit: filters.limit,
  };
  return repo.findAllVenues(repoFilters);
}

export async function approveVenue(venueId: string, adminId: string): Promise<IVenue> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');

  workflow.canApprove(venue);

  const updated = await repo.updateVenueStatus(venueId, 'Approved', adminId);
  if (!updated) throw new NotFoundError('Venue not found');

  const ownerEmail = await findUserEmailById(venue.ownerUserId.toString());
  if (ownerEmail) {
    try {
      await enqueueEmailTask(
        ownerEmail,
        EmailIntent.VENUE_APPROVED,
        `Your Venue "${venue.name}" has been Approved!`,
        EmailTaskStatus.PENDING,
        { venueName: venue.name }
      );
    } catch (err) {
      logWarn('Failed to queue venue approved email', {
        module: 'venue.service.ts/approveVenue',
        venueId,
        error: (err as Error).message,
      });
    }
  }

  return updated;
}

export async function rejectVenue(
  venueId: string,
  adminId: string,
  dto: RejectVenueDTO
): Promise<IVenue> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');

  workflow.canReject(venue);

  // Calculate edit deadline
  let editDeadline = new Date(Date.now() + VENUE_CONSTANTS.EDIT_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  let extendedAt: Date | undefined;
  let extendedBy: mongoose.Types.ObjectId | undefined;
  let originalDeadline = editDeadline;

  if (dto.extendedDeadline) {
    const minDeadline = new Date(
      Date.now() + VENUE_CONSTANTS.EDIT_WINDOW_DAYS * 24 * 60 * 60 * 1000
    );
    const maxDeadline = new Date(
      Date.now() + VENUE_CONSTANTS.MAX_EXTENDED_DAYS * 24 * 60 * 60 * 1000
    );

    if (dto.extendedDeadline < minDeadline || dto.extendedDeadline > maxDeadline) {
      throw new ValidationError(
        `Extended deadline must be between ${String(VENUE_CONSTANTS.EDIT_WINDOW_DAYS)} and ${String(VENUE_CONSTANTS.MAX_EXTENDED_DAYS)} days`
      );
    }

    editDeadline = dto.extendedDeadline;
    extendedAt = new Date();
    extendedBy = new mongoose.Types.ObjectId(adminId);
    originalDeadline = new Date(
      Date.now() + VENUE_CONSTANTS.EDIT_WINDOW_DAYS * 24 * 60 * 60 * 1000
    );
  }

  const rejectionEntry = {
    reason: dto.rejectionReason,
    rejectedAt: new Date(),
    rejectedBy: new mongoose.Types.ObjectId(adminId),
    submissionNumber: venue.rejectionHistory.length + 1,
    editDeadline,
    extendedAt,
    extendedBy,
    originalDeadline,
  };

  const updated = await VenueModel.findByIdAndUpdate(
    venueId,
    {
      $set: {
        status: 'Rejected',
        rejectionReason: dto.rejectionReason, // backward compat
        currentEditDeadline: editDeadline,
        updatedBy: new mongoose.Types.ObjectId(adminId),
        lastSubmittedAt: new Date(),
      },
      $push: { rejectionHistory: rejectionEntry },
    },
    { new: true }
  ).exec();

  if (!updated) throw new NotFoundError('Venue not found');

  const ownerEmail = await findUserEmailById(venue.ownerUserId.toString());
  if (ownerEmail && dto.rejectionReason) {
    try {
      await enqueueEmailTask(
        ownerEmail,
        EmailIntent.VENUE_REJECTED,
        `Application Update: Venue "${venue.name}"`,
        EmailTaskStatus.PENDING,
        {
          venueName: venue.name,
          reason: dto.rejectionReason,
          editDeadline: editDeadline.toISOString(),
          submissionNumber: String(rejectionEntry.submissionNumber),
        }
      );
    } catch (err) {
      logWarn('Failed to queue venue rejected email', {
        module: 'venue.service.ts/rejectVenue',
        venueId,
        error: (err as Error).message,
      });
    }
  }

  // Log activity
  const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
  await logModerationAction(adminId, 'reject_venue', venueId, 'venue', dto.rejectionReason, {
    submissionNumber: rejectionEntry.submissionNumber,
    editDeadline,
    isExtended: !!dto.extendedDeadline,
    actor: 'admin',
  });

  return updated;
}

export async function suspendVenue(
  venueId: string,
  adminId: string,
  dto: SuspendVenueDTO
): Promise<IVenue> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');

  workflow.canDeactivate(venue);

  const extra = { suspensionReason: dto.suspensionReason };
  const updated = await repo.updateVenueStatus(venueId, 'Suspended', adminId, extra);
  if (!updated) throw new NotFoundError('Venue not found');

  const ownerEmail = await findUserEmailById(venue.ownerUserId.toString());
  if (ownerEmail) {
    try {
      await enqueueEmailTask(
        ownerEmail,
        EmailIntent.VENUE_SUSPENDED,
        `Important: Your Venue "${venue.name}" has been Suspended`,
        EmailTaskStatus.PENDING,
        { venueName: venue.name, reason: dto.suspensionReason }
      );
    } catch (err) {
      logWarn('Failed to queue venue suspended email', {
        module: 'venue.service.ts/suspendVenue',
        venueId,
        error: (err as Error).message,
      });
    }
  }

  // Log activity
  const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
  await logModerationAction(adminId, 'suspend_venue', venueId, 'venue', dto.suspensionReason);

  return updated;
}

export async function unsuspendVenue(venueId: string, adminId: string): Promise<IVenue> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');

  workflow.canActivate(venue);

  const updated = await repo.updateVenueStatus(venueId, 'Approved', adminId);
  if (!updated) throw new NotFoundError('Venue not found');

  const ownerEmail = await findUserEmailById(venue.ownerUserId.toString());
  if (ownerEmail) {
    try {
      await enqueueEmailTask(
        ownerEmail,
        EmailIntent.VENUE_UNSUSPENDED,
        `Your Venue "${venue.name}" has been Reactivated`,
        EmailTaskStatus.PENDING,
        { venueName: venue.name }
      );
    } catch (err) {
      logWarn('Failed to queue venue unsuspended email', {
        module: 'venue.service.ts/unsuspendVenue',
        venueId,
        error: (err as Error).message,
      });
    }
  }

  // Log activity
  const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
  await logModerationAction(adminId, 'unsuspend_venue', venueId, 'venue');

  return updated;
}

export async function extendVenueEditDeadline(
  venueId: string,
  superAdminId: string,
  newDeadline: Date
): Promise<IVenue> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');

  // Must be in Rejected status with active deadline
  if (venue.status !== 'Rejected') {
    throw new ValidationError('Can only extend deadline for rejected venues');
  }
  if (!venue.currentEditDeadline || venue.currentEditDeadline < new Date()) {
    throw new ValidationError('No active edit deadline to extend (already expired or suspended)');
  }

  // Validate new deadline
  const minDeadline = new Date(); // must be in future
  const maxDeadline = new Date(
    Date.now() + VENUE_CONSTANTS.MAX_EXTENDED_DAYS * 24 * 60 * 60 * 1000
  );

  if (newDeadline <= minDeadline || newDeadline > maxDeadline) {
    throw new ValidationError(
      `New deadline must be in the future and within ${String(VENUE_CONSTANTS.MAX_EXTENDED_DAYS)} days`
    );
  }
  if (newDeadline <= venue.currentEditDeadline) {
    throw new ValidationError('New deadline must be later than current deadline');
  }

  // Update latest rejection history entry
  const latestRejection = venue.rejectionHistory[venue.rejectionHistory.length - 1];

  const updated = await VenueModel.findByIdAndUpdate(
    venueId,
    {
      $set: {
        currentEditDeadline: newDeadline,
        'rejectionHistory.$[elem].editDeadline': newDeadline,
        'rejectionHistory.$[elem].extendedAt': new Date(),
        'rejectionHistory.$[elem].extendedBy': new mongoose.Types.ObjectId(superAdminId),
        updatedBy: new mongoose.Types.ObjectId(superAdminId),
      },
    },
    {
      arrayFilters: [{ 'elem._id': latestRejection._id }],
      new: true,
    }
  ).exec();

  if (!updated) throw new NotFoundError('Venue not found');

  // Log activity
  const { logModerationAction } = await import('../moderation/moderationActivity.service.js');
  const previousDeadline = venue.currentEditDeadline.toISOString();
  await logModerationAction(
    superAdminId,
    'extend_venue_deadline',
    venueId,
    'venue',
    `Extended edit deadline from ${previousDeadline} to ${newDeadline.toISOString()}`,
    { actor: 'system (superadmin)', previousDeadline: venue.currentEditDeadline, newDeadline }
  );

  // Email owner about extension
  const ownerEmail = await findUserEmailById(venue.ownerUserId.toString());
  if (ownerEmail) {
    try {
      await enqueueEmailTask(
        ownerEmail,
        EmailIntent.VENUE_DEADLINE_EXTENDED,
        `Edit Deadline Extended for "${venue.name}"`,
        EmailTaskStatus.PENDING,
        { venueName: venue.name, newDeadline: newDeadline.toISOString() }
      );
    } catch (err) {
      logWarn('Failed to queue venue deadline extended email', {
        module: 'venue.service.ts/extendVenueEditDeadline',
        venueId,
        error: (err as Error).message,
      });
    }
  }

  return updated;
}

export async function featureVenue(venueId: string, durationDays: number | null): Promise<void> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');

  if (venue.status !== 'Approved') {
    throw new ConflictError('Only approved venues can be featured');
  }

  await repo.upsertFeaturedVenue(venueId, durationDays);
}

export async function getFeaturedVenues(): Promise<
  (IVenue & { featuredExpiresAt?: Date | null })[]
> {
  return repo.getFeaturedVenues();
}

export async function unfeatureVenue(venueId: string): Promise<void> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');

  await repo.removeFeaturedVenue(venueId);
}

// Review Management (admin)

export async function getReviewsList(): Promise<IVenue[]> {
  return VenueModel.find({
    pendingReview: { $exists: true, $ne: null },
    deleted: false,
  })
    .select('name city status pendingReview inactivity ownerUserId')
    .populate('ownerUserId', 'username email')
    .sort({ 'pendingReview.requestedAt': -1 })
    .lean()
    .exec();
}

export async function approveReview(
  venueId: string,
  adminId: string,
  _note?: string
): Promise<IVenue> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');
  if (!venue.pendingReview) throw new ConflictError('Venue has no pending review');

  const adminObjectId = new mongoose.Types.ObjectId(adminId);

  switch (venue.pendingReview.intent) {
    case ReviewIntent.VENUE_EDIT: {
      // Changes are already applied. Just clear pendingReview.
      const updated = await VenueModel.findByIdAndUpdate(
        venueId,
        {
          $unset: { pendingReview: '' },
          $set: { updatedBy: adminObjectId },
        },
        { new: true }
      ).exec();
      if (!updated) throw new NotFoundError('Venue not found');
      return updated;
    }

    case ReviewIntent.INACTIVITY_REQUEST: {
      const lastFutureBooking = await BookingModel.findOne({
        venueId: new mongoose.Types.ObjectId(venueId),
        status: BookingStatus.CONFIRMED,
        date: { $gte: new Date().toISOString().split('T')[0] },
      })
        .sort({ date: -1 })
        .lean()
        .exec();

      let blockedAfterDate: Date;
      if (lastFutureBooking) {
        blockedAfterDate = new Date(lastFutureBooking.date);
        blockedAfterDate.setDate(blockedAfterDate.getDate() + 1);
      } else {
        blockedAfterDate = new Date();
      }

      const updated = await VenueModel.findByIdAndUpdate(
        venueId,
        {
          $set: {
            status: 'Inactive',
            'inactivity.approvedAt': new Date(),
            'inactivity.blockedAfterDate': blockedAfterDate,
            'inactivity.inactiveAt': new Date(),
            updatedBy: adminObjectId,
          },
          $unset: { pendingReview: '' },
        },
        { new: true }
      ).exec();
      if (!updated) throw new NotFoundError('Venue not found');
      return updated;
    }

    case ReviewIntent.INACTIVITY_WITHDRAWAL: {
      const updated = await VenueModel.findByIdAndUpdate(
        venueId,
        {
          $unset: {
            pendingReview: '',
            'inactivity.requestedAt': '',
            'inactivity.approvedAt': '',
            'inactivity.blockedAfterDate': '',
            'inactivity.withdrawalRequestedAt': '',
          },
          $set: { updatedBy: adminObjectId },
        },
        { new: true }
      ).exec();
      if (!updated) throw new NotFoundError('Venue not found');
      return updated;
    }

    case ReviewIntent.DELETION_REQUEST: {
      const deleted = await repo.softDeleteVenue(venueId, adminId);
      if (!deleted) throw new NotFoundError('Venue not found');
      const updated = await repo.findVenueById(venueId);
      if (!updated) throw new NotFoundError('Venue not found');
      return updated;
    }

    default:
      throw new ValidationError(
        `Cannot approve review with intent "${venue.pendingReview.intent}"`
      );
  }
}

export async function rejectReview(
  venueId: string,
  adminId: string,
  _note: string
): Promise<IVenue> {
  const venue = await repo.findVenueById(venueId);
  if (!venue) throw new NotFoundError('Venue not found');
  if (!venue.pendingReview) throw new ConflictError('Venue has no pending review');

  const adminObjectId = new mongoose.Types.ObjectId(adminId);

  if (venue.pendingReview.intent === ReviewIntent.VENUE_EDIT) {
    const snapshot = venue.pendingReview.details.previousSnapshot;
    if (snapshot && Object.keys(snapshot).length > 0) {
      const updated = await VenueModel.findByIdAndUpdate(
        venueId,
        {
          $set: { ...snapshot, updatedBy: adminObjectId },
          $unset: { pendingReview: '' },
        },
        { new: true }
      ).exec();
      if (!updated) throw new NotFoundError('Venue not found');
      return updated;
    }
  }

  // For all other intents (and VENUE_EDIT without snapshot): just clear pendingReview
  const updated = await VenueModel.findByIdAndUpdate(
    venueId,
    {
      $unset: { pendingReview: '' },
      $set: { updatedBy: adminObjectId },
    },
    { new: true }
  ).exec();
  if (!updated) throw new NotFoundError('Venue not found');
  return updated;
}
