"use client";

import {
    BadgeCheck,
    Car,
    Heart,
    MapPin,
    Snowflake,
    Star,
    Users,
} from "lucide-react";
import {
    getVenueAmenities,
    getVenueCapacity,
    getVenueLocation,
    getVenuePrice,
    getVenuePrimaryImage,
    getVenueVerified,
} from "@/features/venues/services/VenuService";

import { AppText } from "@/lib/language/LanguageHelper";
import { Button } from "@/components/ui/button/Button";
import NxtImage from "next/image";
import { Venue } from "@/types/Venue";
import { cardStyle } from "./CardStyle";

type CardProps = {
  venue: Venue;
  onViewDetails?: (venue: Venue) => void;
};

export default function Card({ venue, onViewDetails }: CardProps) {
    const image = getVenuePrimaryImage(venue);
    const VenueLocation = getVenueLocation(venue);
    const price = getVenuePrice(venue);
    const amenities = getVenueAmenities(venue);
    const capacity = getVenueCapacity(venue);
    const verified = getVenueVerified(venue);
    const moreAmenities = amenities.length > 2 ? amenities.length - 2 : 0;

    return (
        <div className={cardStyle.cardWrapper}>

            {/* Image */}
            <div className={cardStyle.imageWrapper}>
                <NxtImage
                    height={220}
                    width={340}
                    src={image}
                    alt={venue.name}
                    className={cardStyle.image}
                />

                {/* Availability Badge */}
                <div className={cardStyle.availabilityBadge}>
                    {venue.isActive ? (
                        <AppText textName="AVAILABLE" textModule="LABEL" />
                    ) : (
                        <AppText textName="UNAVAILABLE" textModule="LABEL" />
                    )}
                </div>

                {/* Wishlist */}
                <button className={cardStyle.wishlistBtn}>
                    <Heart className="h-5 w-5 text-white" />
                </button>

            </div>

            {/* Content */}
            <div className={cardStyle.contentWrapper}>

                {/* Venue Name + Rating */}
                <div className={cardStyle.headerRow}>

                    <div className={cardStyle.titleContainer}>
                        <h3 className={cardStyle.title}>
                            {venue.name}
                        </h3>
                    </div>

                    <div className={cardStyle.ratingContainer}>
                        <Star className={cardStyle.ratingIcon} />
                        <span className={cardStyle.ratingText}>
                            {4.5}
                        </span>

                        <span className={cardStyle.reviewsCount}>
              ({24})
                        </span>
                    </div>

                </div>

                {/* Location */}
                <div className={cardStyle.locationRow}>

                    <MapPin className={cardStyle.locationIcon} />

                    <span>{VenueLocation}</span>

                    <span>•</span>

                    <span>1.5 km</span>

                </div>

                {/* Verified */}
                {verified && (
                    <div className={cardStyle.verifiedBadge}>

                        <BadgeCheck className={cardStyle.verifiedIcon} />
                        <span className={cardStyle.verifiedText}>
                            <AppText textName="VERIFIED_VENUE" textModule="LABEL" />
                        </span>

                    </div>
                )}

                {/* Amenities */}
                <div className={cardStyle.amenitiesContainer}>

                    <div className={cardStyle.amenityItem}>
                        <Users className={cardStyle.amenityIcon} />
                        <span>
                            <AppText textName="GUEST_COUNT" textModule="LABEL" append={{ count: capacity }} />
                        </span>
                    </div>

                    {amenities[ 0 ] && (
                        <div className={cardStyle.amenityItem}>
                            <Snowflake className={cardStyle.amenityIcon} />
                            <span>{amenities[ 0 ]}</span>
                        </div>
                    )}

                    {amenities[ 1 ] && (
                        <div className={cardStyle.amenityItem}>
                            <Car className={cardStyle.amenityIcon} />
                            <span>{amenities[ 1 ]}</span>
                        </div>
                    )}

                    <div className={cardStyle.moreAmenitiesText}>
                        <AppText textName="MORE" textModule="LABEL" append={{ count: moreAmenities }} />
                    </div>

                </div>

                {/* Footer */}
                <div className={cardStyle.footerRow}>

                    <div>

                        <div className={cardStyle.priceContainer}>

                            <span className={cardStyle.priceText}>
                ₹{price.toLocaleString()}
                            </span>

                            <span className={cardStyle.priceUnit}>
                                <AppText textName="PRICE_UNIT" textModule="LABEL" />
                            </span>

                        </div>

                    </div>

                    <Button
                        className={cardStyle.detailsBtn}
                        onClick={() => {
                            onViewDetails?.(venue);
                        }}
                    >
                        <AppText textName="VIEW_DETAILS" textModule="BUTTON" />
                    </Button>

                </div>

            </div>

        </div>
    );
}
