import type { VenueImage } from "../entities/venue-image.entity";

export interface IVenueImageRepository {
    create(images: VenueImage[]): Promise<void>;
    delete(id: string): Promise<void>;
    findByVenueId(venueId: string,): Promise<VenueImage[]>;
}