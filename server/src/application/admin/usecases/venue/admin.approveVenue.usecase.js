import { NotFoundError }
from "../../../../domain/errors/NotFoundError.js";

import { BadRequestError }
from "../../../../domain/errors/BadRequestError.js";

import { VenueMessages }
from "../../../../shared/constants/messages/venueMessages.js";

import { VenueApprovalStatus } from "../../../../domain/enums/Venue.enum.js";

export class AdminApproveVenueUsecase {

    constructor(
        venueRepository,
        mailService
    ) {

        this._venueRepository = venueRepository;
        this._mailService = mailService;

    }

    async execute(venueId) {

        const venue =
            await this._venueRepository.findById(venueId);

        if (!venue) {

            throw new NotFoundError(
                VenueMessages.error.VENUE_NOT_FOUND
            );

        }

        if (
            venue.approvalStatus ===
            VenueApprovalStatus.APPROVED
        ) {

            throw new BadRequestError(
                VenueMessages.error.VENUE_ALREADY_APPROVED
             );

        }

        const approvedVenue =
            await this._venueRepository.approveVenue(
                venueId
            );

        await this._mailService
            .sendVenueApprovalMail(
                approvedVenue
            );

        return approvedVenue;

    }

}