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

import { Button } from "@/components/ui/button/Button";
import NxtImage from "next/image";
import { cardStyle } from "./CardStyle";

type Venue = {
  id: number;
  name: string;
  image: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  verified: boolean;
  guests: number;
  amenities: string[];
  moreAmenities: number;
  availability: string;
  price: number;
};

type CardProps = {
  venue: Venue;
};

export default function Card({ venue }: CardProps) {
    return (
        <div className={cardStyle.cardWrapper}>

            {/* Image */}
            <div className={cardStyle.imageWrapper}>
                <NxtImage
                    height={220}
                    width={340}
                    src={venue.image}
                    alt={venue.name}
                    className={cardStyle.image}
                />

                {/* Availability Badge */}
                <div className={cardStyle.availabilityBadge}>
                    {venue.availability}
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
                            {venue.rating}
                        </span>

                        <span className={cardStyle.reviewsCount}>
              ({venue.reviews})
                        </span>
                    </div>

                </div>

                {/* Location */}
                <div className={cardStyle.locationRow}>

                    <MapPin className={cardStyle.locationIcon} />

                    <span>{venue.location}</span>

                    <span>•</span>

                    <span>{venue.distance}</span>

                </div>

                {/* Verified */}
                {venue.verified && (
                    <div className={cardStyle.verifiedBadge}>

                        <BadgeCheck className={cardStyle.verifiedIcon} />
                        <span className={cardStyle.verifiedText}>
              Verified Venue
                        </span>

                    </div>
                )}

                {/* Amenities */}
                <div className={cardStyle.amenitiesContainer}>

                    <div className={cardStyle.amenityItem}>
                        <Users className={cardStyle.amenityIcon} />
                        <span>{venue.guests} Guests</span>
                    </div>

                    {venue.amenities[ 0 ] && (
                        <div className={cardStyle.amenityItem}>
                            <Snowflake className={cardStyle.amenityIcon} />
                            <span>{venue.amenities[ 0 ]}</span>
                        </div>
                    )}

                    {venue.amenities[ 1 ] && (
                        <div className={cardStyle.amenityItem}>
                            <Car className={cardStyle.amenityIcon} />
                            <span>{venue.amenities[ 1 ]}</span>
                        </div>
                    )}

                    <div className={cardStyle.moreAmenitiesText}>
            +{venue.moreAmenities} More
                    </div>

                </div>

                {/* Footer */}
                <div className={cardStyle.footerRow}>

                    <div>

                        <div className={cardStyle.priceContainer}>

                            <span className={cardStyle.priceText}>
                ₹{venue.price.toLocaleString()}
                            </span>

                            <span className={cardStyle.priceUnit}>
                / day onwards
                            </span>

                        </div>

                    </div>

                    <Button className={cardStyle.detailsBtn}>
            View Details
                    </Button>

                </div>

            </div>

        </div>
    );
}
