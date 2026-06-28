import { NotFoundError }
from "../../../../domain/errors/NotFoundError.js";

import { BadRequestError }
from "../../../../domain/errors/BadRequestError.js";

import { VenueMessages }
from "../../../../shared/constants/messages/venueMessages.js";

import { VenueApprovalStatus }
from "../../../../domain/enums/Venue.enum.js";

export class AdminRejectVenueUsecase {

    constructor(
        venueRepository,
        mailService
    ) {

        this._venueRepository = venueRepository;
        this._mailService = mailService;

    }

    async execute(
        venueId,
        reason
    ) {

        const venue =
            await this._venueRepository.findById(
                venueId
            );

        if (!venue) {

            throw new NotFoundError(
                VenueMessages.error.VENUE_NOT_FOUND
            );

        }

        if (!reason?.trim()) {

            throw new BadRequestError(
                VenueMessages.error.REJECTION_REASON_REQUIRED
            );

        }

        if (
            venue.approvalStatus ===
            VenueApprovalStatus.REJECTED
        ) {

            throw new BadRequestError(
                VenueMessages.error.VENUE_ALREADY_REJECTED
            );

        }

        const rejectedVenue =
            await this._venueRepository.rejectVenue(
                venueId,
                reason
            );

        await this._mailService
            .sendVenueRejectionMail(
                rejectedVenue,
                reason
            );

        return rejectedVenue;

    }

}