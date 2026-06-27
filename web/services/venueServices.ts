import { apiFetch } from "./api";

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