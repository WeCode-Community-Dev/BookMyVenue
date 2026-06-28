import { VenueDetails, VenueStatus } from "@/lib/data/venues";
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
};

export type AmenityResponse = {
    id: string;
    name: string;
    description: string;
}[]

export type OwnedVenueResponse = {
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

export type VenueResponse = VenueDetails

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

export async function createImages(images: { url: string, altText: string }[]): Promise<{ id: string }[]> {
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

export async function getOwnedVenues(): Promise<OwnedVenueResponse[]> {
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
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getVenue(id: string): Promise<VenueResponse> {
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
