import {
    CalendarDays,
    MapPin,
    MoreVertical,
    Users,
} from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";
import Image from "next/image";
import { VenueCardProps } from "@/types/Venue";
import { miniCardStyle } from "./MiniCardStyle";

const getStatusStylesClass = (venueStatus: string) => {
    switch (venueStatus?.toUpperCase()) {
        case "APPROVED":
            return miniCardStyle.statusApproved;
        case "PENDING":
            return miniCardStyle.statusPending;
        case "REJECTED":
            return miniCardStyle.statusRejected;
        default:
            return miniCardStyle.statusDefault;
    }
};

export default function VenueCard({
    imageUrl,
    venueName,
    venueLocation,
    guests,
    price,
    venueStatus,
}: VenueCardProps) {
    return (
        <div className={miniCardStyle.card}>
            <div className={miniCardStyle.imageWrapper}>
                <Image
                    src={imageUrl}
                    alt={venueName}
                    fill
                    className={miniCardStyle.image}
                />

                <span className={`${miniCardStyle.statusBadgeBase} ${getStatusStylesClass(venueStatus)}`}>
                    {venueStatus}
                </span>
            </div>

            <div className={miniCardStyle.content}>
                <div className={miniCardStyle.titleWrapper}>
                    <h3 className={miniCardStyle.title}>{venueName}</h3>

                    <button>
                        <MoreVertical size={18} />
                    </button>
                </div>

                <div className={miniCardStyle.locationWrapper}>
                    <MapPin size={14} />
                    {venueLocation}
                </div>

                <div className={miniCardStyle.detailsWrapper}>
                    <div className={miniCardStyle.detailItem}>
                        <Users size={16} />
                        <AppText textName="GUEST_COUNT" textModule="LABEL" 
                            append={{ count: guests.toString() }} />
                    </div>

                    <div className={miniCardStyle.detailItem}>
                        <CalendarDays size={16} />
                        <AppText textName="PRICE_PER_DAY" textModule="LABEL" 
                            append={{ price: price.toLocaleString() }} />
                    </div>
                </div>

                <div className={miniCardStyle.buttonWrapper}>
                    <button className={miniCardStyle.editBtn}>
                        <AppText textName="EDIT" textModule="BUTTON" />
                    </button>

                    <button className={miniCardStyle.bookingsBtn}>
                        <AppText textName="VIEW_BOOKINGS" textModule="BUTTON" />
                    </button>
                </div>
            </div>
        </div>
    );
}
