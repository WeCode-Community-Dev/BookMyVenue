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
    let minPrice = Infinity;
    if (venue.slotTemplates && venue.slotTemplates.length > 0) {
        for (const slot of venue.slotTemplates) {
            if (slot.pricingTiers && slot.pricingTiers.length > 0) {
                for (const tier of slot.pricingTiers) {
                    const tierPrice = Number(tier.price);
                    if (!isNaN(tierPrice) && tierPrice < minPrice) {
                        minPrice = tierPrice;
                    }
                }
            } else if (slot.customRatePerGuestPerHour) {
                const customPrice = Number(slot.customRatePerGuestPerHour);
                if (!isNaN(customPrice) && customPrice < minPrice) {
                    minPrice = customPrice;
                }
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
