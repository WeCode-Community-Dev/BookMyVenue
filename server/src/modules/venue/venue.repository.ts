import type { PaginationParams, PaginatedResponse } from '../../types/pagination.types';
import { buildPaginationMeta } from '../../utils/paginationUtils';
import type {
  IVenue,
  VenueStatus,
  AdminVenueFilters,
  CreateVenueData,
  UpdateVenueData,
  PublicVenueFilters,
} from './venue.types';
import { VenueModel } from './venue.model';
import { VenueDraftModel, type IVenueDraft } from './venueDraft.model';
import { FeaturedVenueModel } from '../../models/featured-venue.model';
import mongoose from 'mongoose';

// Helpers

const toObjectId = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function findActiveVenues(): Promise<IVenue[]> {
  return VenueModel.find({ status: 'Approved', active: true, deleted: false })
    .sort({ createdAt: -1 })
    .select(
      '_id name description venueType city district coverImage maxCapacity avgRating reviewCount flexibleBooking amenities pricing fixedPackages bookingType'
    )
    .exec();
}

// Get lightweight venue pins for map view
export async function findVenuePinsInBounds(bbox?: {
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
  const query: Record<string, unknown> = {
    status: 'Approved',
    active: true,
    deleted: false,
    location: { $exists: true },
  };

  // If bbox is provided, use $geoWithin to filter by bounds
  if (bbox) {
    query.location = {
      $geoWithin: {
        $box: [
          [bbox.swLng, bbox.swLat],
          [bbox.neLng, bbox.neLat],
        ],
      },
    };
  }

  return VenueModel.find(query)
    .select('_id name location coverImage avgRating')
    .lean()
    .exec() as unknown as Promise<
    {
      _id: string;
      name: string;
      location: { coordinates: [number, number] };
      coverImage: string;
      avgRating: number;
    }[]
  >;
}

export async function findPaginatedActiveVenues(
  paginationParams: PaginationParams,
  filters?: PublicVenueFilters
): Promise<PaginatedResponse<IVenue, 'venues'>> {
  const { limit, skip } = paginationParams;
  const conditions: Record<string, unknown>[] = [
    { status: 'Approved', active: true, deleted: false },
  ];

  if (filters?.searchTerm) {
    const searchRegex = new RegExp(escapeRegex(filters.searchTerm), 'i');
    conditions.push({
      $or: [
        { name: searchRegex },
        { city: searchRegex },
        { district: searchRegex },
        { description: searchRegex },
      ],
    });
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    const priceCondition: { $gte?: number; $lte?: number } = {};
    if (filters.minPrice !== undefined) priceCondition.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) priceCondition.$lte = filters.maxPrice;

    conditions.push({
      $or: [
        { 'pricing.basePrice': priceCondition },
        { 'pricing.pricingRules.price': priceCondition },
        { 'fixedPackages.price': priceCondition },
      ],
    });
  }

  if (filters?.venueType && filters.venueType.length > 0) {
    conditions.push({ venueType: { $in: filters.venueType } });
  }

  if (filters?.district) {
    conditions.push({
      district: { $regex: new RegExp(`^${escapeRegex(filters.district)}$`, 'i') },
    });
  }

  if (filters?.capacity) {
    conditions.push({ maxCapacity: { $gte: filters.capacity } });
  }

  if (filters?.spaceAttributes && filters.spaceAttributes.length > 0) {
    conditions.push({ spaceAttributes: { $in: filters.spaceAttributes } });
  }

  if (filters?.seatingConfigurations && filters.seatingConfigurations.length > 0) {
    conditions.push({ seatingConfigurations: { $in: filters.seatingConfigurations } });
  }

  if (filters?.amenities && filters.amenities.length > 0) {
    conditions.push({ amenities: { $all: filters.amenities } });
  }

  // Geospatial: $geoWithin/$centerSphere for composability with other filters
  if (filters?.lat !== undefined && filters.lng !== undefined) {
    const radiusKm = filters.radiusKm ?? 25;
    const radiusRadians = radiusKm / 6378.1; // Earth's mean radius in km

    conditions.push({
      location: {
        $geoWithin: {
          $centerSphere: [[filters.lng, filters.lat], radiusRadians],
        },
      },
    });
  }

  const query = { $and: conditions };

  let sortOption: Record<string, 1 | -1> = { createdAt: -1, _id: -1 };
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        sortOption = { 'pricing.basePrice': 1, _id: 1 };
        break;
      case 'price-high':
        sortOption = { 'pricing.basePrice': -1, _id: -1 };
        break;
      case 'rating':
        sortOption = { avgRating: -1, reviewCount: -1, _id: -1 };
        break;
      case 'distance':
        // For distance sorting, must use $near, which auto-sorts by distance
        // This branch handles the special case where distance-sort is requested
        sortOption = { createdAt: -1, _id: -1 }; // Fallback; prefer lat+lng sorting
        break;
      default:
        sortOption = { createdAt: -1, _id: -1 };
        break;
    }
  }

  const [venues, total] = await Promise.all([
    VenueModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select(
        '_id name description venueType city district coverImage maxCapacity avgRating reviewCount flexibleBooking amenities pricing fixedPackages bookingType'
      )
      .exec(),
    VenueModel.countDocuments(query).exec(),
  ]);

  return {
    venues,
    pagination: buildPaginationMeta(total, paginationParams),
  };
}

// Read Operations
export async function findVenueById(
  venueId: string,
  session?: mongoose.ClientSession
): Promise<IVenue | null> {
  const query = VenueModel.findOne({ _id: toObjectId(venueId), deleted: false });
  if (session) query.session(session);
  return query.exec();
}

// Check if an active venue with this name already exists for this owner
export async function existsByOwnerAndName(
  ownerUserId: string,
  name: string,
  excludeVenueId?: string
): Promise<boolean> {
  const query: Record<string, unknown> = {
    ownerUserId: toObjectId(ownerUserId),
    name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') },
    deleted: false,
  };

  if (excludeVenueId) {
    query._id = { $ne: toObjectId(excludeVenueId) };
  }

  const count = await VenueModel.countDocuments(query).exec();
  return count > 0;
}

export async function findVenueNameAndOwner(
  venueId: string
): Promise<{ name: string; ownerUserId: mongoose.Types.ObjectId } | null> {
  return VenueModel.findById(venueId).select('name ownerUserId').lean().exec();
}

export async function venueExists(venueId: string): Promise<boolean> {
  const exists = await VenueModel.exists({ _id: venueId, deleted: false }).exec();
  return exists !== null;
}

export async function findVenuesByIds(
  venueIds: string[]
): Promise<{ _id: mongoose.Types.ObjectId }[]> {
  return VenueModel.find({ _id: { $in: venueIds }, deleted: false })
    .select('_id')
    .lean()
    .exec();
}

export async function findMyVenuesProjected(
  ownerUserId: string
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
  const [venues, featuredDocs] = await Promise.all([
    VenueModel.find(
      { ownerUserId: toObjectId(ownerUserId), deleted: false },
      {
        _id: 1,
        name: 1,
        city: 1,
        district: 1,
        venueType: 1,
        coverImage: 1,
        status: 1,
        rejectionReason: 1,
        rejectionHistory: 1,
        submissionCount: 1,
        currentEditDeadline: 1,
        suspensionReason: 1,
        createdAt: 1,
      }
    )
      .sort({ createdAt: -1 })
      .lean()
      .exec(),
    FeaturedVenueModel.find().select('venueId').lean().exec(),
  ]);

  const featuredSet = new Set(featuredDocs.map((f) => f.venueId.toString()));
  return venues.map((v) => ({
    ...v,
    isFeatured: featuredSet.has(v._id.toString()),
  }));
}

// Admin
export async function findPendingVenues(): Promise<IVenue[]> {
  return VenueModel.find({
    status: 'PendingReview',
    deleted: false,
  })
    .sort({ createdAt: 1 })
    .exec();
}

// Admin
export async function findAllVenues(
  filters: AdminVenueFilters
): Promise<PaginatedResponse<IVenue, 'venues'>> {
  const { status, city, page, limit } = filters;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { deleted: false };
  if (status) query.status = status;
  if (city) query.city = { $regex: new RegExp(`^${escapeRegex(city)}$`, 'i') };

  const [rawVenues, totalCount, featuredDocs] = await Promise.all([
    VenueModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate('ownerUserId', 'username email')
      .lean()
      .exec(),
    VenueModel.countDocuments(query).exec(),
    FeaturedVenueModel.find().select('venueId').lean().exec(),
  ]);

  const featuredSet = new Set(featuredDocs.map((f) => f.venueId.toString()));

  const venues = rawVenues.map((v) => ({
    ...v,
    isActive: v.status === 'Approved',
    isFeatured: featuredSet.has(v._id.toString()),
  })) as unknown as IVenue[];

  return {
    venues,
    pagination: buildPaginationMeta(totalCount, { page, limit, skip, sort: '-createdAt' }),
  };
}

// Write Operations
export async function createVenue(data: CreateVenueData): Promise<IVenue> {
  const venue = new VenueModel(data);
  return venue.save();
}

// Draft Operations
export async function upsertDraft(
  userId: string,
  step: number,
  formValues: Record<string, unknown>
): Promise<IVenueDraft> {
  return VenueDraftModel.findOneAndUpdate(
    { userId: toObjectId(userId) },
    { $set: { step, formValues } },
    { new: true, upsert: true }
  ).exec();
}

export async function getDraft(userId: string): Promise<IVenueDraft | null> {
  return VenueDraftModel.findOne({ userId: toObjectId(userId) }).exec();
}

export async function deleteDraft(userId: string): Promise<void> {
  await VenueDraftModel.deleteOne({ userId: toObjectId(userId) }).exec();
}

export async function updateVenue(venueId: string, patch: UpdateVenueData): Promise<IVenue | null> {
  return VenueModel.findOneAndUpdate(
    { _id: toObjectId(venueId), deleted: false },
    { $set: patch },
    { new: true, runValidators: true }
  ).exec();
}

export async function softDeleteVenue(venueId: string, updatedBy: string): Promise<boolean> {
  const result = await VenueModel.updateOne(
    { _id: toObjectId(venueId), deleted: false },
    {
      $set: {
        deleted: true,
        active: false,
        updatedBy: toObjectId(updatedBy),
      },
    }
  ).exec();

  return result.modifiedCount > 0;
}

// State Machine Operations
export async function updateVenueStatus(
  venueId: string,
  newStatus: VenueStatus,
  updatedBy: string,
  extraFields?: Partial<IVenue>
): Promise<IVenue | null> {
  const patch: mongoose.UpdateQuery<IVenue> = {
    $set: {
      status: newStatus,
      updatedBy: toObjectId(updatedBy),
      ...(extraFields ?? {}),
    },
  };

  if (newStatus !== 'Rejected') {
    patch.$unset = { ...patch.$unset, rejectionReason: '' };
  }

  if (newStatus !== 'Suspended') {
    patch.$unset = { ...patch.$unset, suspensionReason: '' };
  }

  return VenueModel.findOneAndUpdate({ _id: toObjectId(venueId), deleted: false }, patch, {
    new: true,
    runValidators: true,
  }).exec();
}

export async function upsertFeaturedVenue(
  venueId: string,
  durationDays: number | null
): Promise<void> {
  const expiresAt = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : null;

  await FeaturedVenueModel.findOneAndUpdate(
    { venueId: toObjectId(venueId) },
    { $set: { expiresAt } },
    { upsert: true, new: true }
  ).exec();
}

export async function getFeaturedVenues(): Promise<
  (IVenue & { featuredExpiresAt?: Date | null })[]
> {
  const featured = await FeaturedVenueModel.find()
    .populate<{ venueId: IVenue }>('venueId')
    .lean()
    .exec();

  return featured
    .filter((f) => Boolean(f.venueId) && f.venueId.status === 'Approved')
    .map((f) => ({
      ...f.venueId,
      featuredExpiresAt: f.expiresAt,
    })) as (IVenue & { featuredExpiresAt?: Date | null })[];
}

export async function removeFeaturedVenue(venueId: string): Promise<void> {
  await FeaturedVenueModel.findOneAndDelete({ venueId: toObjectId(venueId) }).exec();
}
