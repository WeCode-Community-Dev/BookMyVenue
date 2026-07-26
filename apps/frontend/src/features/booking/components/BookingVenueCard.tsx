/* eslint-disable */

import { AppText, getText } from "@/lib/language/LanguageHelper";
import {
    BadgeCheck,
    Building2,
    MapPin,
    Star,
    UsersRound,
} from "lucide-react";
import {
    getVenueAmenities,
    getVenueLocation,
    getVenuePrimaryImage,
    getVenueVerified,
} from "@/features/venues/services/VenuService";

import Image from "next/image";
import { Venue } from "@/types/Venue";
import { bookingVenueCardStyle } from "@/features/booking/styles/BookingVenueCardStyle";

export default function BookingVenueCard({ venue }: { venue?: Venue | null }) {
    if (!venue) {
        return (
            <section className={bookingVenueCardStyle.skeletonCard}>
                <div className={bookingVenueCardStyle.skeletonFlex}>
                    <div className={bookingVenueCardStyle.skeletonImage} />
                    <div className={bookingVenueCardStyle.skeletonContent}>
                        <div className={bookingVenueCardStyle.skeletonTitle} />
                        <div className={bookingVenueCardStyle.skeletonSub1} />
                        <div className={bookingVenueCardStyle.skeletonSub2} />
                    </div>
                </div>
            </section>
        );
    }

    const primaryImage = getVenuePrimaryImage(venue);
    const isVerified = getVenueVerified(venue);
    const locationStr = getVenueLocation(venue);
    const venueAmenities = getVenueAmenities(venue);

    return (
        <section className={bookingVenueCardStyle.card}>

            <div className={bookingVenueCardStyle.cardFlex}>

                {/* Image */}

                <div className={bookingVenueCardStyle.imageWrapper}>

                    <Image
                        src={primaryImage}
                        alt={venue.name}
                        width={430}
                        height={210}
                        priority
                        className={bookingVenueCardStyle.image}
                    />

                </div>

                {/* Right Content */}

                <div className={bookingVenueCardStyle.contentFlex}>

                    {/* Venue Name */}

                    <h2 className={bookingVenueCardStyle.title}>
                        {venue.name}
                    </h2>

                    {/* Rating */}

                    <div className={bookingVenueCardStyle.ratingRow}>

                        <div className={bookingVenueCardStyle.ratingGroup}>

                            <Star className={bookingVenueCardStyle.starIcon} />

                            <span className={bookingVenueCardStyle.ratingValue}>
                                4.8
                            </span>

                            <span className={bookingVenueCardStyle.reviewsCount}>
                                <AppText textName="REVIEWS_COUNT" textModule="LABEL" append={{ count: 128 }} />
                            </span>

                        </div>

                        {isVerified && (
                            <>
                                <div className={bookingVenueCardStyle.divider} />

                                <div className={bookingVenueCardStyle.verifiedGroup}>

                                    <BadgeCheck className={bookingVenueCardStyle.verifiedIcon} />

                                    <span className={bookingVenueCardStyle.verifiedText}>
                                        <AppText textName="VERIFIED_VENUE" textModule="LABEL" />
                                    </span>

                                </div>
                            </>
                        )}

                    </div>

                    {/* Venue Details */}

                    <div className={bookingVenueCardStyle.detailsRow}>

                        <div className={bookingVenueCardStyle.detailGroup}>

                            <MapPin className={bookingVenueCardStyle.detailIcon} />

                            <span className={bookingVenueCardStyle.detailText}>
                                {locationStr}
                            </span>

                        </div>

                        <div className={bookingVenueCardStyle.divider} />

                        <div className={bookingVenueCardStyle.detailGroup}>

                            <Building2 className={bookingVenueCardStyle.detailIcon} />

                            <span className={bookingVenueCardStyle.detailText}>
                                {getText("TYPE_" + venue.venueType.toUpperCase(), "BASIC_INFO")}
                            </span>

                        </div>

                        <div className={bookingVenueCardStyle.divider} />

                        <div className={bookingVenueCardStyle.detailGroup}>

                            <UsersRound className={bookingVenueCardStyle.detailIcon} />

                            <span className={bookingVenueCardStyle.capacityText}>
                                <AppText textName="GUESTS_RANGE" textModule="LABEL" append={{ min: venue.capacityMin, max: venue.capacityMax }} />
                            </span>

                        </div>

                    </div>

                    {/* Amenities */}

                    {venueAmenities.length > 0 && (
                        <div className={bookingVenueCardStyle.amenitiesBox}>

                            <div className={bookingVenueCardStyle.amenitiesFlex}>

                                {venueAmenities.slice(0, 5).map((amenity) => (

                                    <div
                                        key={amenity}
                                        className={bookingVenueCardStyle.amenityGroup}
                                    >
                                        <Building2 className={bookingVenueCardStyle.amenityIcon} />

                                        <span className={bookingVenueCardStyle.amenityText}>
                                            {amenity}
                                        </span>

                                    </div>

                                ))}

                                {venueAmenities.length > 5 && (
                                    <span className={bookingVenueCardStyle.moreAmenities}>
                                        <AppText textName="MORE" textModule="LABEL" append={{ count: venueAmenities.length - 5 }} />
                                    </span>
                                )}

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </section>
    );
}