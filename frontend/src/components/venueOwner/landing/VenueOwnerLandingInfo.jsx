import { VENUE_OWNER_BENEFITS } from "./venueOwnerBenefits.js";
import { VenueOwnerBenefitCard } from "./VenueOwnerBenefitCard.jsx";

// The marketing / landing content shown beside the login card.
export function VenueOwnerLandingInfo() {
    return (
        <div className="w-full lg:flex-1">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600">
                For Venue Owners
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                Grow your venue business with BookMyVenue
            </h1>
            <p className="mb-8 max-w-xl text-gray-600">
                Put your venues in front of customers who are ready to book.
                List your spaces, manage bookings and get paid — all in one place.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
                {VENUE_OWNER_BENEFITS.map((benefit) => (
                    <VenueOwnerBenefitCard key={benefit.title} {...benefit} />
                ))}
            </div>
        </div>
    );
}
