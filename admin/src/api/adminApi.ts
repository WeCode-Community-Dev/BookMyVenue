import type { Customer, VenueOwner } from '../data/mockStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
const USERS_ENDPOINT = import.meta.env.VITE_USERS_ENDPOINT?.trim() ?? '';
const VENUE_OWNERS_ENDPOINT = import.meta.env.VITE_VENUE_OWNERS_ENDPOINT?.trim() ?? '';
const VENUE_OWNER_STATUS_ENDPOINT =
  import.meta.env.VITE_VENUE_OWNER_STATUS_ENDPOINT?.trim() ?? '/api/v1/auth/venue-owner/update-status';

type ApiEntity = Record<string, unknown>;

export interface AdminDirectoryData {
  customers?: Customer[];
  owners?: VenueOwner[];
}

export type VenueOwnerStatusCode = 0 | 1 | 2;

export interface VenueOwnerStatusUpdate {
  ownerId: string;
  approvalStatus: VenueOwner['kycStatus'];
}

export const hasDirectoryApiConfig = Boolean(
  API_BASE_URL && (USERS_ENDPOINT || VENUE_OWNERS_ENDPOINT)
);

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

const getJson = async (endpoint: string) => {
  const response = await fetch(buildUrl(endpoint), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }

  return response.json() as Promise<unknown>;
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
    throw new Error(`API request failed with ${response.status}`);
  }

  return response.json() as Promise<unknown>;
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
