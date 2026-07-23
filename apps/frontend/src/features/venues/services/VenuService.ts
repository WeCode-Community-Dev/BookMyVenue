import { Venue } from "@/types/Venue";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function getVenuePrimaryImage(venue: Venue): string {
    return (
        venue.images?.find((img) => {
            return img.isPrimary; 
        })?.url ||
    venue.images?.[ 0 ]?.url ||
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3"
    );
}

export function getVenueImages(venue: Venue): string[] {
    return venue.images?.map((img) => {
        return img.url; 
    }) || [
    ];
}

export function getVenueLocation(venue: Venue): string {
    return `${venue.addressLine}, ${venue.city}`;
}

export function getVenueAmenities(venue: Venue): string[] {
    return venue.amenities?.map((amnty) => {
        return amnty.amenity.name; 
    }) || [
    ];
}

export function getVenuePrice(venue: Venue): number {
    if (!venue.slotTemplates || venue.slotTemplates.length === 0) {
        return 5000;
    }

    let minPrice = Infinity;

    for (const slot of venue.slotTemplates) {
        const prices = (slot.pricingTiers || [
        ])
            .map((tier) => {
                return Number(tier.price); 
            })
            .filter((price) => {
                return !isNaN(price); 
            });
        
        if (prices.length > 0) {
            const minTierPrice = Math.min(...prices);
            if (minTierPrice < minPrice) {
                minPrice = minTierPrice;
            }
        } else if (slot.customRatePerGuestPerHour) {
            const customPrice = Number(slot.customRatePerGuestPerHour);
            if (!isNaN(customPrice) && customPrice < minPrice) {
                minPrice = customPrice;
            }
        }
    }

    return minPrice === Infinity ? 5000 : minPrice;
}

export function getVenueCapacity(venue: Venue): number {
    return venue.capacityMax;
}

export function getVenueVerified(venue: Venue): boolean {
    return venue.status === "APPROVED";
}

export async function fetchVenues(): Promise<Venue[]> {
    const url = `${BASE_URL}/venue/all`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch venues: ${response.statusText}`);
        }
        const resData = await response.json();
        return (resData || [
        ])
            .filter((vnu: Venue) => {
                return vnu.status === "APPROVED"; 
            });
    } catch (error) {
        console.error("Error in fetchVenues:", error);
        throw error;
    }
}

export async function getVenueById(id: string): Promise<Venue> {
    const url = `${BASE_URL}/venue/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch venue: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in getVenueById:", error);
        throw error;
    }
}
