import { NotFoundError }
from "../../../../domain/errors/NotFoundError.js";

import { VenueMessages }
from "../../../../shared/constants/messages/venueMessages.js";

export class AdminGetVenueByIdUsecase {

    constructor(venueRepository) {
        this._venueRepository = venueRepository;
    }

    async execute(venueId) {

        const venue =
            await this._venueRepository.findById(venueId);

        if (!venue) {

            throw new NotFoundError(
                VenueMessages.error.VENUE_NOT_FOUND
            );

        }

        return venue;

    }

}