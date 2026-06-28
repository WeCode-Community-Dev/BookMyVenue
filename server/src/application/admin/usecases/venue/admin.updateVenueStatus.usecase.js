import { NotFoundError }
    from "../../../../domain/errors/NotFoundError.js";

import { BadRequestError }
    from "../../../../domain/errors/BadRequestError.js";

import { VenueMessages }
    from "../../../../shared/constants/messages/venueMessages.js";

import { VenueStatus } from "../../../../domain/enums/Venue.enum.js";

export class AdminUpdateVenueBlockStatusUsecase {

    constructor(
        venueRepository
    ) {

        this._venueRepository =
            venueRepository;

    }

    async execute({

        venueId,

        isBlocked

    }) {

        const venue =
            await this._venueRepository.findById(
                venueId
            );

        if (!venue) {

            throw new NotFoundError(
                VenueMessages.error.VENUE_NOT_FOUND
            );

        }

        if (
            venue.approvalStatus !==
            VenueStatus.ACTIVE
        ) {

            throw new BadRequestError(
                VenueMessages.error
                    .ONLY_APPROVED_VENUE_CAN_BE_BLOCKED
            );

        }

        const updatedVenue = await this._venueRepository
            .updateBlockStatus(
                venueId,
                isBlocked
            );
        return updatedVenue

    }

}