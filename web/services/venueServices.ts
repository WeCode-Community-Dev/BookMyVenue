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

export async function fetchAmenities(): Promise<AmenityResponse> {
    try{
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

export async function createImages(images: {url: string, altText: string}[]): Promise<{id: string}[]> {
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
            body: JSON.stringify({images: images}),

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