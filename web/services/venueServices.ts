import { CapacityType, Space, VenueDetails, VenueStatus } from "@/lib/data/venues";
import { apiFetch } from "./api";

export type CreateVenuePayload = {
    name: string;
    description?: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    timezone: string;
    venueAmenityIds?: string[];
    venueImageIds?: string[];
    coverImageId?: string;
};

export type AmenityResponse = {
    id: string;
    name: string;
    description: string;
}[]

export type VenueResponse = {
    name: string
    id: string
    address: string
    spaces?: number;
    bookings?: number;
    status?: VenueStatus;
    images:
    {
        image:
        {
            id: string
            url: string
            altText: string | null;
        };
    }[];
};

export type VenueDetailedResponse = VenueDetails

export type SpaceCategoryResponse = {
    id: string;
    name: string;
    description: string | null;
};

export type CreateSpacePayload = {
    name: string;
    description?: string;
    rules?: string;
    capacityValue?: number;
    capacityType?: string;
    isActive?: boolean;
    categoryId: string;
    spaceAmenityIds?: string[];
    spaceImageIds?: string[];
    coverImageId?: string;
};

export type SpaceOperatingHourInput = {
    weekday: number;
    openTime: string;
    closeTime: string;
    isClosed?: boolean;
};

export type CreateSpaceOperatingHoursPayload = {
    hours: SpaceOperatingHourInput[];
};

export type CreateSpaceBlockedPeriodPayload = {
    startAt: string;
    endAt: string;
    reason?: string;
};

export type UpdateSpaceBlockedPeriodPayload = Partial<CreateSpaceBlockedPeriodPayload>;

export type SpaceOperatingHourResponse = {
    weekday: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
};

export type SpaceOperatingHourRecord = SpaceOperatingHourResponse & {
    id: string;
    spaceId: string;
};

export type SpaceBlockedPeriodResponse = {
    id: string;
    startAt: string;
    endAt: string;
    reason: string | null;
};

export type PricingType =
    | 'HOURLY'
    | 'SESSION'
    | 'DAILY'
    | 'EVENT'
    | 'CUSTOM';

export type BrowseVenueImage = {
    id: string;
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
    createdAt: string;
};

export type BrowseVenueAmenity = {
    id: string;
    name: string;
};

export type BrowseVenueSpacePricing = {
    pricingType: PricingType;
    amount: string;
    currency: string;
};

export type BrowseVenueSpace = {
    categoryId: string;
    spacePricing: BrowseVenueSpacePricing[];
    capacityType: CapacityType | null;
    capacityValue: string | null;
};

export type BrowseVenueListItem = {
    id: string;
    ownerId: string;
    name: string;
    description: string | null;
    address: string;
    city: string;
    state: string | null;
    country: string;
    postalCode: string | null;
    latitude: string | null;
    longitude: string | null;
    timezone: string;
    createdAt: string;
    updatedAt: string;
    images: BrowseVenueImage[];
    amenities: BrowseVenueAmenity[];
    spaces: BrowseVenueSpace[];
};

export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
};

export type GetVenuesResult = {
    venues: BrowseVenueListItem[];
    meta: PaginationMeta;
};

export const VENUES_PAGE_LIMIT = 10;

export type UpsertSpacePricingPayload = {
    pricingType: PricingType;
    amount: number;
    currency: string;
    minBooking?: number;
    maxBooking?: number;
};

export type SpacePricingResponse = {
    id: string;
    spaceId: string;
    pricingType: PricingType;
    amount: string;
    currency: string;
    minBooking: number | null;
    maxBooking: number | null;
    createdAt: string;
};


export async function fetchAmenities(): Promise<AmenityResponse> {
    try {
        const response = await apiFetch('/amenities', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function saveImages(images: { url: string, altText: string }[]): Promise<{ id: string, url: string }[]> {
    try {
        if (images.length === 0) {
            return [];
        }
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No access token found');
        }
        const response = await apiFetch('/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ images: images }),

        });
        return response;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getVenues(
    page: number = 1,
    limit: number = VENUES_PAGE_LIMIT,
    amenityIds?:string,
    categoryId?:string,
    search?:string
): Promise<GetVenuesResult> {
    try {
        const response = await apiFetch(`/venues?page=${page}&limit=${limit}&amenityIds=${amenityIds}&categoryId=${categoryId}&search=${search ?? ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return {
            venues: response.data ?? [],
            meta: response.meta,
        };
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createVenue(venue: CreateVenuePayload) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No access token found');
        }
        const response = await apiFetch('/venues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({
                ...venue,
                venueAmenityIds: venue.venueAmenityIds ?? [],
                venueImageIds: venue.venueImageIds ?? [],
            }),
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getOwnedVenues(): Promise<VenueResponse[]> {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No access token found');
        }
        const response = await apiFetch('/venues/owned', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        });
        if (!response.success) {
            throw new Error(response.message);
        }
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getVenue(id: string): Promise<VenueDetailedResponse> {
    try {
        // const accessToken = localStorage.getItem('accessToken');
        // if (!accessToken) {
        //     throw new Error('No access token found');
        // }
        const response = await apiFetch(`/venues/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: accessToken,
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSpace(id: string): Promise<Space> {
    try {
        const response = await apiFetch(`/spaces/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function getSpaceCategories(): Promise<SpaceCategoryResponse[]> {
    try {
        const response = await apiFetch('/space-categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getCapacityTypes(): Promise<string[]> {
    try {
        const response = await apiFetch('/capacity-types', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getPricingTypes(): Promise<PricingType[]> {
    try {
        const response = await apiFetch('/pricing-types', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function upsertSpacePricing(
    spaceId: string,
    payload: UpsertSpacePricingPayload,
): Promise<SpacePricingResponse> {
    try {
        const response = await apiFetch(`/spaces/${spaceId}/pricing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSpacePricing(
    spaceId: string,
): Promise<SpacePricingResponse[]> {
    try {
        const response = await apiFetch(`/spaces/${spaceId}/pricing`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createSpace(venueId: string, payload: CreateSpacePayload) {
    try {
        const response = await apiFetch(`/venues/${venueId}/spaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                spaceAmenityIds: payload.spaceAmenityIds ?? [],
                spaceImageIds: payload.spaceImageIds ?? [],
            }),
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createSpaceOperatingHours(
    spaceId: string,
    payload: CreateSpaceOperatingHoursPayload,
): Promise<SpaceOperatingHourRecord[]> {
    try {
        const response = await apiFetch(`/spaces/${spaceId}/operating-hours`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSpaceOperatingHours(
    spaceId: string,
): Promise<SpaceOperatingHourResponse[]> {
    try {
        const response = await apiFetch(`/spaces/${spaceId}/operating-hours`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createSpaceBlockedPeriod(
    spaceId: string,
    payload: CreateSpaceBlockedPeriodPayload,
): Promise<SpaceBlockedPeriodResponse & { spaceId: string }> {
    try {
        const response = await apiFetch(`/spaces/${spaceId}/blocked-periods`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSpaceBlockedPeriods(
    spaceId: string,
): Promise<SpaceBlockedPeriodResponse[]> {
    try {
        const response = await apiFetch(`/spaces/${spaceId}/blocked-periods`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getSpaceBookedPeriods(
    spaceId: string,
): Promise<SpaceBlockedPeriodResponse[]> {
    try {
        const response = await apiFetch(`/bookings/spaces/${spaceId}/occupancy`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateSpaceBlockedPeriod(
    spaceId: string,
    id: string,
    payload: UpdateSpaceBlockedPeriodPayload,
): Promise<SpaceBlockedPeriodResponse & { spaceId: string }> {
    try {
        const response = await apiFetch(`/spaces/${spaceId}/blocked-periods/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function removeSpaceBlockedPeriod(
    spaceId: string,
    id: string,
): Promise<void> {
    try {
        const response = await apiFetch(`/spaces/${spaceId}/blocked-periods/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export type DashboardStatsResponse = {
    totalVenues: number;
    totalSpaces: number;
    totalBookings: number;
}

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No access token found');
        }
        const response = await apiFetch('/dashboard/stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
