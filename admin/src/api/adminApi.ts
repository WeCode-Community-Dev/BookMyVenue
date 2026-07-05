import type { Customer, Venue, VenueOwner, Amenity, Booking } from '../data/mockStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
const USERS_ENDPOINT = import.meta.env.VITE_USERS_ENDPOINT?.trim() ?? '';
const VENUE_OWNERS_ENDPOINT = import.meta.env.VITE_VENUE_OWNERS_ENDPOINT?.trim() ?? '';
const VENUES_ENDPOINT = import.meta.env.VITE_VENUES_ENDPOINT?.trim() ?? '/api/v1/venue-owner/venue?skip=0&limit=20&approved=false';
const VENUE_OWNER_STATUS_ENDPOINT =
  import.meta.env.VITE_VENUE_OWNER_STATUS_ENDPOINT?.trim() ?? '/api/v1/auth/venue-owner/update-status';
const AMENITIES_ENDPOINT = import.meta.env.VITE_AMENITIES_ENDPOINT?.trim() ?? '/api/v1/venue-owner/venue/amenities';
const VENUE_STATUS_UPDATE_ENDPOINT = import.meta.env.VITE_VENUE_STATUS_UPDATE_ENDPOINT?.trim() ?? '/api/v1/venue-owner/venue/update-status';
const BOOKINGS_ENDPOINT = import.meta.env.VITE_BOOKINGS_ENDPOINT?.trim() ?? '/api/v1/bookings';


const DEFAULT_VENUE_PHOTO = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800';

type ApiEntity = Record<string, unknown>;

export interface AdminDirectoryData {
  customers?: Customer[];
  owners?: VenueOwner[];
}

export interface AdminVenuesData {
  venues: Venue[];
}

export type VenueOwnerStatusCode = 0 | 1 | 2;

export interface VenueOwnerStatusUpdate {
  ownerId: string;
  approvalStatus: VenueOwner['kycStatus'];
}

export const hasDirectoryApiConfig = Boolean(
  API_BASE_URL && (USERS_ENDPOINT || VENUE_OWNERS_ENDPOINT)
);

export const hasVenuesApiConfig = Boolean(API_BASE_URL && VENUES_ENDPOINT);
export const hasAmenitiesApiConfig = Boolean(API_BASE_URL && AMENITIES_ENDPOINT);
export const hasBookingsApiConfig = Boolean(API_BASE_URL && BOOKINGS_ENDPOINT);

const buildUrl = (endpoint: string) => {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = endpoint.replace(/^\/+/, '');
  return `${base}/${path}`;
};

const readString = (entity: ApiEntity, keys: string[], fallback = '') => {
  for (const key of keys) {
    const value = entity[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    if (typeof value === 'number') {
      return String(value);
    }
  }

  return fallback;
};

const readRecord = (entity: ApiEntity, key: string): ApiEntity => {
  const value = entity[key];
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as ApiEntity : {};
};

const readEntityArray = (entity: ApiEntity, key: string): ApiEntity[] => {
  const value = entity[key];
  return Array.isArray(value) ? value.filter((item): item is ApiEntity => item !== null && typeof item === 'object') : [];
};

const readNumber = (entity: ApiEntity, keys: string[], fallback = 0) => {
  for (const key of keys) {
    const value = entity[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
};

const readArray = (payload: unknown): ApiEntity[] => {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is ApiEntity => item !== null && typeof item === 'object');
  }

  if (payload !== null && typeof payload === 'object') {
    const record = payload as ApiEntity;
    const nested = record.data ?? record.users ?? record.customers ?? record.owners ?? record.results;
    return readArray(nested);
  }

  return [];
};

const normalizeStatus = (status: string): Customer['status'] | VenueOwner['status'] => {
  const value = status.toLowerCase();
  return value === 'blocked' || value === 'suspended' || value === 'inactive' ? 'blocked' : 'active';
};

const normalizeKycStatus = (status: string): VenueOwner['kycStatus'] => {
  const value = status.toLowerCase();
  if (value === 'verified' || value === 'approved') {
    return 'verified';
  }
  if (value === 'rejected' || value === 'declined') {
    return 'rejected';
  }
  return 'pending';
};

const normalizeVenueStatus = (status: string): Venue['status'] => {
  const value = status.toLowerCase();
  if (value === 'approved') {
    return 'approved';
  }
  if (value === 'rejected' || value === 'suspended' || value === 'blocked') {
    return 'blocked';
  }
  return 'pending';
};

const normalizeDate = (value: string) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString().slice(0, 10);
};

const normalizeCustomer = (entity: ApiEntity, index: number): Customer => {
  const id = readString(entity, ['id', '_id', 'userId', 'customerId'], `CUST-${String(index + 1).padStart(3, '0')}`);
  const firstName = readString(entity, ['firstName']);
  const lastName = readString(entity, ['lastName']);
  const fullName = `${firstName} ${lastName}`.trim();
  const phone = readString(entity, ['phone', 'mobile', 'phoneNumber', 'mobile_number']);

  return {
    id,
    name: readString(entity, ['name', 'fullName', 'full_name', 'username'], fullName || phone || 'Unnamed Customer'),
    email: readString(entity, ['email', 'emailAddress']),
    phone,
    joinedDate: normalizeDate(readString(entity, ['joinedDate', 'createdAt', 'created_at', 'dateJoined'])),
    status: normalizeStatus(readString(entity, ['status', 'accountStatus'], 'active')),
    bookingsCount: readNumber(entity, ['bookingsCount', 'totalBookings', 'bookingCount']),
    totalSpent: readNumber(entity, ['totalSpent', 'spent', 'totalAmount']),
    complaintsCount: readNumber(entity, ['complaintsCount', 'reportsCount'])
  };
};

const normalizeOwner = (entity: ApiEntity, index: number): VenueOwner => {
  const id = readString(entity, ['id', '_id', 'ownerId', 'venueOwnerId'], `OWN-${String(index + 1).padStart(3, '0')}`);
  const ownerProfile = readRecord(entity, 'owner_profile');
  const firstName = readString(entity, ['firstName']);
  const lastName = readString(entity, ['lastName']);
  const fullName = `${firstName} ${lastName}`.trim();
  const phone = readString(entity, ['phone', 'mobile', 'phoneNumber', 'mobile_number']);

  return {
    id,
    name: readString(entity, ['name', 'fullName', 'full_name', 'username'], fullName || phone || 'Unnamed Owner'),
    email: readString(entity, ['email', 'emailAddress']),
    phone,
    companyName: readString(
      ownerProfile,
      ['business_name', 'businessName', 'companyName', 'organizationName'],
      readString(entity, ['companyName', 'businessName', 'business_name', 'organizationName'], 'Unregistered Business')
    ),
    businessProofUrl: readString(entity, ['businessProofUrl', 'businessProof', 'documentUrl', 'kycDocument']),
    kycStatus: normalizeKycStatus(
      readString(ownerProfile, ['approval_status', 'kycStatus', 'verificationStatus'], readString(entity, ['kycStatus', 'kyc', 'verificationStatus'], 'pending'))
    ),
    status: normalizeStatus(readString(entity, ['status', 'accountStatus'], 'active')),
    joinedDate: normalizeDate(readString(entity, ['joinedDate', 'createdAt', 'created_at', 'dateJoined'])),
    venuesCount: readNumber(entity, ['venuesCount', 'totalVenues', 'venueCount']),
    totalBookings: readNumber(entity, ['totalBookings', 'bookingsCount', 'bookingCount']),
    revenueGenerated: readNumber(entity, ['revenueGenerated', 'revenue', 'totalRevenue'])
  };
};

const normalizeVenue = (entity: ApiEntity, index: number): Venue => {
  const location = readRecord(entity, 'location');
  const slots = readEntityArray(entity, 'slots');
  const galleryImages = readEntityArray(entity, 'gallery_images');
  const amenities = readEntityArray(entity, 'amenities')
    .map((amenity) => readString(amenity, ['name']))
    .filter(Boolean);
  const locationLabel = [
    readString(location, ['address']),
    readString(location, ['city']),
    readString(location, ['state']),
    readString(location, ['country']),
    readString(location, ['pincode'])
  ].filter(Boolean).join(', ');
  const coverImage = readString(entity, ['cover_image_url', 'coverImageUrl']);
  const photos = [
    coverImage,
    ...galleryImages.map((image) => readString(image, ['image_url', 'imageUrl']))
  ].filter((photo) => photo && photo !== 'string');
  const slotPrices = slots
    .map((slot) => readNumber(slot, ['price']))
    .filter((price) => price > 0);
  const lowestSlotPrice = slotPrices.length > 0 ? Math.min(...slotPrices) : 0;
  const venueName = readString(entity, ['venue_name', 'venueName', 'name'], `Venue ${index + 1}`);
  const ownerId = readString(entity, ['owner_id', 'ownerId']);

  // Extract slots details
  const slotsArray = slots.map(slot => ({
    id: readString(slot, ['id']),
    slot_name: readString(slot, ['slot_name', 'slotName']),
    start_time: readString(slot, ['start_time', 'startTime']),
    end_time: readString(slot, ['end_time', 'endTime']),
    price: readNumber(slot, ['price'])
  }));

  // Extract add-on services details
  const servicesArray = readEntityArray(entity, 'services').map(service => ({
    id: readString(service, ['id']),
    service_name: readString(service, ['service_name', 'serviceName']),
    price: readNumber(service, ['price'])
  }));

  return {
    id: readString(entity, ['id', '_id', 'venueId'], `VEN-${String(index + 1).padStart(3, '0')}`),
    name: venueName,
    ownerId,
    ownerName: readString(entity, ['owner_name', 'ownerName'], ownerId || 'Unassigned Owner'),
    location: locationLabel || readString(entity, ['location'], 'Location not available'),
    capacity: readNumber(entity, ['max_capacity', 'maxCapacity', 'capacity']),
    pricePerDay: lowestSlotPrice,
    amenities: amenities.length > 0 ? amenities : ['Amenities not listed'],
    photos: photos.length > 0 ? photos : [DEFAULT_VENUE_PHOTO],
    status: normalizeVenueStatus(readString(entity, ['verification_status', 'status'], 'draft')),
    featured: Boolean(entity.is_featured ?? entity.featured),
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      bookedDates: []
    },
    reviews: [],
    bookingCount: readNumber(entity, ['booking_count', 'bookingCount']),
    revenue: 0,
    
    // New backend details fields mapping
    category: readString(entity, ['category']),
    description: readString(entity, ['description']),
    venue_size: readNumber(entity, ['venue_size', 'venueSize']),
    instant_booking: Boolean(entity.instant_booking ?? entity.instantBooking),
    slots: slotsArray,
    services: servicesArray,
    virtual_tour_url: readString(entity, ['virtual_tour_url', 'virtualTourUrl']),
    verification_status: readString(entity, ['verification_status', 'verificationStatus']),
    created_at: readString(entity, ['created_at', 'createdAt']),
    updated_at: readString(entity, ['updated_at', 'updatedAt'])
  };
};

const checkResponseStatus = (payload: unknown) => {
  if (payload !== null && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (record.status === false) {
      throw new Error(typeof record.message === 'string' ? record.message : 'API returned a failure status.');
    }
  }
};

const getJson = async (endpoint: string) => {
  const response = await fetch(buildUrl(endpoint), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    let errMsg = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json() as { message?: string; detail?: string };
      if (errorData && typeof errorData === 'object') {
        errMsg = errorData.message || errorData.detail || errMsg;
      }
    } catch {
      // JSON parsing failed, use default error message
    }
    throw new Error(errMsg);
  }

  const payload = await response.json();
  checkResponseStatus(payload);
  return payload;
};

const postJson = async (endpoint: string, body: unknown) => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errMsg = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json() as { message?: string; detail?: string };
      if (errorData && typeof errorData === 'object') {
        errMsg = errorData.message || errorData.detail || errMsg;
      }
    } catch {
      // JSON parsing failed, use default error message
    }
    throw new Error(errMsg);
  }

  const payload = await response.json();
  checkResponseStatus(payload);
  return payload;
};

const deleteJson = async (endpoint: string) => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    let errMsg = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json() as { message?: string; detail?: string };
      if (errorData && typeof errorData === 'object') {
        errMsg = errorData.message || errorData.detail || errMsg;
      }
    } catch {
      // JSON parsing failed, use default error message
    }
    throw new Error(errMsg);
  }

  if (response.status === 204) {
    return null;
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const payload = await response.json();
    checkResponseStatus(payload);
    return payload;
  }
  return null;
};

const patchJson = async (endpoint: string, body: unknown) => {
  const response = await fetch(buildUrl(endpoint), {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errMsg = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json() as { message?: string; detail?: string };
      if (errorData && typeof errorData === 'object') {
        errMsg = errorData.message || errorData.detail || errMsg;
      }
    } catch {
      // JSON parsing failed, use default error message
    }
    throw new Error(errMsg);
  }

  const payload = await response.json();
  checkResponseStatus(payload);
  return payload;
};


export const fetchAdminDirectoryData = async (): Promise<AdminDirectoryData> => {
  const [usersPayload, ownersPayload] = await Promise.all([
    USERS_ENDPOINT ? getJson(USERS_ENDPOINT) : Promise.resolve(null),
    VENUE_OWNERS_ENDPOINT ? getJson(VENUE_OWNERS_ENDPOINT) : Promise.resolve(null)
  ]);

  return {
    customers: usersPayload ? readArray(usersPayload).map(normalizeCustomer) : undefined,
    owners: ownersPayload ? readArray(ownersPayload).map(normalizeOwner) : undefined
  };
};
export const fetchAdminVenuesData = async (skip = 0, limit = 20): Promise<AdminVenuesData> => {
  const baseUrl = VENUES_ENDPOINT.split('?')[0];
  const url = `${baseUrl}?skip=${skip}&limit=${limit}&approved=false`;
  const venuesPayload = await getJson(url);

  return {
    venues: readArray(venuesPayload).map(normalizeVenue)
  };
};

export const updateVenueOwnerApprovalStatus = async (
  ownerId: string,
  status: VenueOwnerStatusCode
): Promise<VenueOwnerStatusUpdate> => {
  const payload = await patchJson(VENUE_OWNER_STATUS_ENDPOINT, {
    owner_id: ownerId,
    status
  });
  const record = payload !== null && typeof payload === 'object' ? payload as ApiEntity : {};
  const data = readRecord(record, 'data');
  const responseOwnerId = readString(data, ['owner_id', 'ownerId', 'user_id'], ownerId);
  const fallbackStatus = status === 0 ? 'approved' : status === 1 ? 'rejected' : 'pending';

  return {
    ownerId: responseOwnerId,
    approvalStatus: normalizeKycStatus(readString(data, ['approval_status', 'kycStatus', 'verificationStatus'], fallbackStatus))
  };
};

export const fetchAmenitiesApi = async (): Promise<Amenity[]> => {
  const payload = await getJson(AMENITIES_ENDPOINT);
  return readArray(payload).map((entity, index) => {
    const id = readString(entity, ['id', 'uuid', '_id'], `AMEN-${index + 1}`);
    const name = readString(entity, ['name'], 'Unnamed Amenity');
    return { id, name };
  });
};

export const createAmenityApi = async (name: string): Promise<Amenity> => {
  const payload = await postJson(AMENITIES_ENDPOINT, { name });
  const record = payload !== null && typeof payload === 'object' ? payload as ApiEntity : {};
  
  // Support both wrapped response {"data": {"id": ...}} and unwrapped {"id": ...}
  const hasData = record.data !== null && typeof record.data === 'object' && !Array.isArray(record.data);
  const entity = hasData ? (record.data as ApiEntity) : record;
  
  const id = readString(entity, ['id', 'uuid', '_id'], 'temp-id');
  const responseName = readString(entity, ['name'], name);
  return { id, name: responseName };
};


export const deleteAmenityApi = async (amenity_id: string): Promise<void> => {
  await deleteJson(`${AMENITIES_ENDPOINT}/${amenity_id}`);
};

export interface VenueStatusUpdateResponse {
  status: boolean;
  message?: string;
  data?: unknown;
}

export type VenueStatusCode = 'pending' | 'approved' | 'rejected' | 'suspended';

export const updateVenueStatusApi = async (
  venueId: string,
  status: VenueStatusCode,
  rejectionReason?: string
): Promise<VenueStatusUpdateResponse> => {
  const payload = await patchJson(VENUE_STATUS_UPDATE_ENDPOINT, {
    venue_id: venueId,
    status,
    rejection_reason: rejectionReason || null
  });
  return payload as VenueStatusUpdateResponse;
};

const normalizeBookingStatus = (status: string, eventDate?: string): Booking['status'] => {
  const s = status?.toLowerCase() || '';
  if (s === 'cancelled' || s === 'refunded') return 'cancelled';
  if (s === 'failed' || s === 'noshow') return 'failed';
  if (s === 'completed' || s === 'done' || s === 'finished') return 'completed';
  if (s === 'paid' || s === 'payed') {
    if (eventDate) {
      const today = new Date().toISOString().slice(0, 10);
      return eventDate >= today ? 'upcoming' : 'completed';
    }
    return 'completed';
  }
  return 'upcoming';
};

const normalizeBookingPaymentStatus = (status: string, bookingStatus: string): Booking['paymentStatus'] => {
  const s = status?.toLowerCase() || '';
  const bs = bookingStatus?.toLowerCase() || '';
  if (s === 'paid' || s === 'payed' || s === 'completed' || bs === 'completed' || bs === 'paid' || bs === 'payed') return 'paid';
  if (s === 'refunded' || bs === 'cancelled') return 'refunded';
  if (s === 'failed' || bs === 'failed') return 'failed';
  return 'pending';
};

const normalizeBooking = (entity: ApiEntity, index: number, commissionPercentage = 10): Booking => {
  const id = readString(entity, ['id'], `BKG-${String(index + 1).padStart(3, '0')}`);
  const amount = readNumber(entity, ['amount']);
  const commissionAmount = Number((amount * (commissionPercentage / 100)).toFixed(2));
  const bookingDateStr = readString(entity, ['created_at', 'createdAt', 'bookingDate', 'booking_date']);
  const eventDateStr = readString(entity, ['booking_date', 'bookingDate', 'eventDate', 'event_date']);
  const statusStr = readString(entity, ['status']);

  const status = normalizeBookingStatus(statusStr, eventDateStr);
  const paymentStatus = normalizeBookingPaymentStatus(readString(entity, ['payment_status', 'paymentStatus']), statusStr);

  const slots = readEntityArray(entity, 'slots').map(slot => ({
    id: readString(slot, ['id']),
    slot_name: readString(slot, ['slot_name', 'slotName']),
    start_time: readString(slot, ['start_time', 'startTime']),
    end_time: readString(slot, ['end_time', 'endTime']),
    price: readNumber(slot, ['price'])
  }));

  return {
    id,
    customerId: readString(entity, ['customer_id', 'customerId', 'user_id', 'userId'], 'CUST-API'),
    customerName: readString(entity, ['customer_name', 'customerName', 'user_name', 'userName'], 'Guest Client'),
    customerEmail: readString(entity, ['customer_email', 'customerEmail', 'email'], 'guest@example.com'),
    venueId: readString(entity, ['venue_id', 'venueId']),
    venueName: readString(entity, ['venue_name', 'venueName'], 'Unknown Venue'),
    ownerId: readString(entity, ['owner_id', 'ownerId'], ''),
    ownerName: readString(entity, ['owner_name', 'ownerName'], 'Venue Partner'),
    bookingDate: normalizeDate(bookingDateStr),
    eventDate: normalizeDate(eventDateStr),
    guestCount: readNumber(entity, ['guest_count', 'guestCount'], 1),
    status,
    paymentStatus,
    amount,
    commissionAmount,
    notes: readString(entity, ['notes', 'special_instructions', 'remarks']),
    slots: slots.length > 0 ? slots : undefined
  };
};

export const fetchBookingsApi = async (commissionPercentage = 10): Promise<Booking[]> => {
  const payload = await getJson(BOOKINGS_ENDPOINT);
  return readArray(payload).map((entity, index) => normalizeBooking(entity, index, commissionPercentage));
};



