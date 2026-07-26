import Venue from '@/models/venue.model';
import User from '@/models/user.model';
import Booking from '@/models/booking.model';
import { BookingStatus } from '@/constants/booking';
import { escapeRegex } from '@/utils/escapeRegex';
import { VenueDocument } from '@/types/venue.types';
import { CreateVenueDTO } from '@/dto/venue/create-venue.dto';
import { UpdateVenueDTO } from '@/dto/venue/update-venue.dto';
import { GetOwnerVenuesQueryDTO } from '@/dto/venue/get-owner-venues.dto';
import { GetAdminVenuesQueryDTO } from '@/dto/admin/get-venues.dto';
import { GetPublicVenuesQueryDTO } from '@/dto/venue/get-public-venues.dto';

type Return = Promise<VenueDocument>;

export const createVenue = async (ownerId: string, venueData: CreateVenueDTO): Return => {
  return await Venue.create({ ownerId, ...venueData });
};

export const findVenueById = async (id: string): Promise<VenueDocument | null> => {
  return await Venue.findById(id).populate('categoryId', 'name').populate('availability');
};

export const findVenuesByOwner = async (ownerId: string, query: GetOwnerVenuesQueryDTO) => {
  const { page, limit, search, status, category, sort, isDeleted } = query;

  const filter: Record<string, any> = {
    ownerId,
    isDeleted: isDeleted === 'true',
  };

  // Status filter
  if (status && status !== 'all') {
    filter.verificationStatus = status;
  }

  // Category filter
  if (category) {
    filter.categoryId = category;
  }

  // Search filter (name or description)
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOption: Record<string, 1 | -1> = {
    createdAt: sort === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [venues, total] = await Promise.all([
    Venue.find(filter)
      .populate('categoryId', 'name')
      .populate('availability')
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Venue.countDocuments(filter),
  ]);

  return {
    venues,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateVenue = async (
  id: string,
  data: UpdateVenueDTO
): Promise<VenueDocument | null> => {
  return await Venue.findByIdAndUpdate(id, data, { new: true })
    .populate('categoryId', 'name')
    .populate('availability');
};

export const softDeleteVenue = async (id: string): Promise<VenueDocument | null> => {
  return await Venue.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const restoreVenue = async (id: string): Promise<VenueDocument | null> => {
  return await Venue.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
};

// ── Admin Methods ──────────────────────────────────────────

export const findAllVenues = async (query: GetAdminVenuesQueryDTO) => {
  const { page, limit, search, status, category, sort } = query;

  const filter: Record<string, any> = {
    isDeleted: { $ne: true },
  };

  if (status && status !== 'all') {
    filter.verificationStatus = status;
  }

  if (category) {
    filter.categoryId = category;
  }

  if (search) {
    const matchingUsers = await User.find({ fullName: { $regex: search, $options: 'i' } }).select('_id');

    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { ownerId: { $in: matchingUsers } },
    ];
  }

  const sortOption: Record<string, 1 | -1> = {
    createdAt: sort === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [venues, total] = await Promise.all([
    Venue.find(filter)
      .populate('categoryId', 'name')
      .populate('availability')
      .populate('ownerId', 'fullName email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Venue.countDocuments(filter),
  ]);

  return {
    venues,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findVenueByIdWithOwner = async (id: string): Promise<VenueDocument | null> => {
  return await Venue.findById(id)
    .populate('categoryId', 'name')
    .populate('availability')
    .populate('ownerId', 'fullName email avatar');
};

export const approveVenue = async (id: string): Promise<VenueDocument | null> => {
  return await Venue.findByIdAndUpdate(
    id,
    {
      verificationStatus: 'approved',
      verifiedAt: new Date(),
      rejectionReason: null,
    },
    { new: true }
  )
    .populate('categoryId', 'name')
    .populate('availability');
};

export const rejectVenue = async (
  id: string,
  rejectionReason: string
): Promise<VenueDocument | null> => {
  return await Venue.findByIdAndUpdate(
    id,
    {
      verificationStatus: 'rejected',
      verifiedAt: null,
      rejectionReason,
    },
    { new: true }
  )
    .populate('categoryId', 'name')
    .populate('availability');
};

// ── Public Methods ─────────────────────────────────────────

export const findPublicVenues = async (query: GetPublicVenuesQueryDTO) => {
  const { page, limit, search, category, minCapacity, maxCapacity, minPrice, maxPrice, sort } =
    query;

  // Only show approved, active, non-deleted venues
  const filter: Record<string, any> = {
    verificationStatus: 'approved',
    isActive: true,
    isDeleted: { $ne: true },
    isAvailabilityConfigured:true,
  };

  if (category) {
    filter.categoryId = category;
  }

  if (minCapacity !== undefined || maxCapacity !== undefined) {
    filter.capacity = {};
    if (minCapacity !== undefined) filter.capacity.$gte = minCapacity;
    if (maxCapacity !== undefined) filter.capacity.$lte = maxCapacity;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter['pricing.amount'] = {};
    if (minPrice !== undefined) filter['pricing.amount'].$gte = minPrice;
    if (maxPrice !== undefined) filter['pricing.amount'].$lte = maxPrice;
  }

  if (search) {
    const escaped = escapeRegex(search);
    filter.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
    ];
  }

  // Filter out venues with overlapping active bookings for target date range
  if (query.startDateTime && query.endDateTime) {
    const start = new Date(query.startDateTime);
    const end = new Date(query.endDateTime);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start < end) {
      const bookedBookings = await Booking.find({
        bookingStatus: { $in: [BookingStatus.RESERVED, BookingStatus.CONFIRMED] },
        startDateTime: { $lt: end },
        endDateTime: { $gt: start },
      }).select('venue');
      const unavailableVenueIds = bookedBookings.map((b) => b.venue);
      filter._id = { $nin: unavailableVenueIds };
    }
  }

  // Dynamic sort
  let sortOption: Record<string, 1 | -1>;
  switch (sort) {
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'price_asc':
      sortOption = { 'pricing.amount': 1 };
      break;
    case 'price_desc':
      sortOption = { 'pricing.amount': -1 };
      break;
    case 'capacity_asc':
      sortOption = { capacity: 1 };
      break;
    case 'capacity_desc':
      sortOption = { capacity: -1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const skip = (page - 1) * limit;

  const [venues, total] = await Promise.all([
    Venue.find(filter)
      .populate('categoryId', 'name')
      .populate('availability')
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Venue.countDocuments(filter),
  ]);

  return {
    venues,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findPublicVenueById = async (id: string): Promise<VenueDocument | null> => {
  return await Venue.findOne({
    _id: id,
    verificationStatus: 'approved',
    isActive: true,
    isDeleted: { $ne: true },
    isAvailabilityConfigured:true,
  })
    .populate('categoryId', 'name')
    .populate('availability');
};
