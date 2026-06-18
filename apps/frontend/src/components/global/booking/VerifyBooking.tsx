"use client";

import {
    CalendarDays,
    CheckCircle,
    ExternalLink,
    IndianRupee,
    Info,
    Mail,
    MapPin,
    Phone,
    Star,
    User,
    Users,
    X,
} from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";
import { Button } from "@/components/ui/button/Button";
import NxtImage from "next/image";
import { Venue } from "../card/Card";
import { verifyBookingStyle } from "./VerifyBookingStyle";

interface VenueApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    venue?: Venue | null;
    actionType?: "pay" | "approve";
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: React.ReactNode;
    value: string;
}) {
    return (
        <div className={verifyBookingStyle.infoRowContainer}>
            <div className={verifyBookingStyle.infoRowLabelContainer}>
                {icon}
                <span>{label}</span>
            </div>

            <span className={verifyBookingStyle.infoRowValue}>
                {value}
            </span>
        </div>
    );
}

export default function VenueApprovalModal({
    isOpen,
    onClose,
    venue,
    actionType,
}: VenueApprovalModalProps) {
    if (!isOpen) return null;

    const mainImage = venue
        ? venue.image
        : "https://images.unsplash.com/photo-1566073771259-6a8506099945";

    const galleryImages = [
        mainImage,
        "https://images.unsplash.com/photo-1511578314322-379afb476865",
        "https://images.unsplash.com/photo-1511578314322-379afb476865",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    ];

    const amenitiesList = venue
        ? [
            ...venue.amenities, `+${venue.moreAmenities} More`
        ]
        : [
            "AC", "Parking", "WiFi", "+5 More"
        ];

    const mapSrc = venue
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(venue.location)
        }&zoom=13&size=800x500&key=YOUR_GOOGLE_MAPS_API_KEY`
        : "https://maps.googleapis.com/maps/api/staticmap?center=" +
        "Cherai,Kochi&zoom=13&size=800x500&key=YOUR_GOOGLE_MAPS_API_KEY";

    return (
        <div className={verifyBookingStyle.overlay}>
            <div className={verifyBookingStyle.dialogContainer}>
                {/* Header */}
                <div className={verifyBookingStyle.header}>
                    <div>
                        <h2 className={verifyBookingStyle.title}>
                            {venue ? venue.name : "Lagoona Beach Resort"}
                        </h2>

                        <div className={verifyBookingStyle.locationWrapper}>
                            <MapPin className="h-4 w-4" />
                            {venue ? venue.location : "Cherai, Kochi"}
                        </div>
                    </div>

                    <div className={verifyBookingStyle.headerRight}>
                        <span className={verifyBookingStyle.statusBadge}>
                            <AppText
                                textName="PENDING_APPROVAL"
                                textModule="LABEL"
                            />
                        </span>

                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon"
                            className={verifyBookingStyle.closeBtn}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Gallery */}
                <div className={verifyBookingStyle.galleryGrid}>
                    <div className={verifyBookingStyle.mainImageWrapper}>
                        <NxtImage
                            src={galleryImages[ 0 ]}
                            alt="Venue"
                            width={900}
                            height={600}
                            className={verifyBookingStyle.mainImage}
                        />
                    </div>

                    <div className={verifyBookingStyle.sideImageGrid}>
                        {galleryImages.slice(1).map((img, index) => {
                            return (
                                <div
                                    key={index}
                                    className={verifyBookingStyle.sideImageWrapper}
                                >
                                    <NxtImage
                                        src={img}
                                        alt="Venue"
                                        width={300}
                                        height={200}
                                        className={verifyBookingStyle.sideImage}
                                    />

                                    {index === 3 && (
                                        <div
                                            className={
                                                verifyBookingStyle.moreImagesOverlay
                                            }
                                        >
                                            +6
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Details */}
                <div className={verifyBookingStyle.detailsGrid}>
                    {/* Venue Information */}
                    <div className={verifyBookingStyle.sectionCard}>
                        <h3 className={verifyBookingStyle.sectionTitle}>
                            <Info
                                className={verifyBookingStyle.sectionTitleIcon}
                            />
                            <AppText
                                textName="VENUE_INFORMATION"
                                textModule="LABEL"
                            />
                        </h3>

                        <div className="space-y-4">
                            <InfoRow
                                icon={
                                    <Users
                                        className={verifyBookingStyle.infoRowIcon}
                                    />
                                }
                                label={
                                    <AppText
                                        textName="CAPACITY"
                                        textModule="LABEL"
                                    />
                                }
                                value={
                                    venue ? `${venue.guests} Guests` : "200 Guests"
                                }
                            />

                            <InfoRow
                                icon={
                                    <IndianRupee
                                        className={verifyBookingStyle.infoRowIcon}
                                    />
                                }
                                label={
                                    <AppText
                                        textName="PRICE"
                                        textModule="LABEL"
                                    />
                                }
                                value={
                                    venue
                                        ? `₹${venue.price.toLocaleString()} / day`
                                        : "₹18,000 / day"
                                }
                            />

                            <InfoRow
                                icon={
                                    <Star
                                        className={verifyBookingStyle.infoRowIcon}
                                    />
                                }
                                label={
                                    <AppText
                                        textName="RATING"
                                        textModule="LABEL"
                                    />
                                }
                                value={
                                    venue
                                        ? `${venue.rating} (${venue.reviews} reviews)`
                                        : "4.8 (88 reviews)"
                                }
                            />

                            <InfoRow
                                icon={
                                    <CalendarDays
                                        className={verifyBookingStyle.infoRowIcon}
                                    />
                                }
                                label={
                                    <AppText
                                        textName="AVAILABILITY"
                                        textModule="LABEL"
                                    />
                                }
                                value={
                                    venue
                                        ? venue.availability
                                        : "Available This Weekend"
                                }
                            />

                            <div>
                                <p className="mb-2 text-sm font-medium text-foreground">
                                    <AppText
                                        textName="AMENITIES"
                                        textModule="LABEL"
                                    />
                                </p>

                                <div
                                    className={
                                        verifyBookingStyle.amenitiesContainer
                                    }
                                >
                                    {amenitiesList.map((item) => {
                                        return (
                                            <span
                                                key={item}
                                                className={
                                                    verifyBookingStyle.amenityBadge
                                                }
                                            >
                                                {item}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-foreground">
                                    <AppText
                                        textName="DESCRIPTION"
                                        textModule="LABEL"
                                    />
                                </p>

                                <p className={verifyBookingStyle.descriptionText}>
                                    <AppText
                                        textName="VENUE_DESCRIPTION"
                                        textModule="MESSAGES"
                                    />
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className={verifyBookingStyle.sectionCard}>
                        <h3 className={verifyBookingStyle.sectionTitle}>
                            <MapPin
                                className={verifyBookingStyle.sectionTitleIcon}
                            />
                            <AppText textName="LOCATION" textModule="LABEL" />
                        </h3>

                        <div className={verifyBookingStyle.iframeWrapper}>
                            <iframe
                                src={mapSrc}
                                width={800}
                                height={500}
                                className={verifyBookingStyle.iframe}
                            />
                        </div>

                        <div className={verifyBookingStyle.locationFooter}>
                            <p className={verifyBookingStyle.addressText}>
                                {venue
                                    ? venue.location
                                    : "Cherai, Kochi, Kerala, India"}
                            </p>

                            <Button
                                variant="outline"
                                className={verifyBookingStyle.openInMapsBtn}
                            >
                                <AppText
                                    textName="OPEN_IN_MAPS"
                                    textModule="BUTTON"
                                />
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div className={verifyBookingStyle.sectionCard}>
                        <h3 className={verifyBookingStyle.sectionTitle}>
                            <User
                                className={verifyBookingStyle.sectionTitleIcon}
                            />
                            <AppText
                                textName="OWNER_INFORMATION"
                                textModule="LABEL"
                            />
                        </h3>

                        <div className="space-y-4">
                            <InfoRow
                                icon={
                                    <User
                                        className={verifyBookingStyle.infoRowIcon}
                                    />
                                }
                                label={
                                    <AppText
                                        textName="OWNER_NAME"
                                        textModule="LABEL"
                                    />
                                }
                                value="Vishnu Raj"
                            />

                            <InfoRow
                                icon={
                                    <Mail
                                        className={verifyBookingStyle.infoRowIcon}
                                    />
                                }
                                label={
                                    <AppText
                                        textName="EMAIL"
                                        textModule="LABEL"
                                    />
                                }
                                value="vishnu.raj@example.com"
                            />

                            <InfoRow
                                icon={
                                    <Phone
                                        className={verifyBookingStyle.infoRowIcon}
                                    />
                                }
                                label={
                                    <AppText
                                        textName="PHONE"
                                        textModule="LABEL"
                                    />
                                }
                                value="+91 98765 43210"
                            />

                            <InfoRow
                                icon={
                                    <CalendarDays
                                        className={verifyBookingStyle.infoRowIcon}
                                    />
                                }
                                label={
                                    <AppText
                                        textName="MEMBER_SINCE"
                                        textModule="LABEL"
                                    />
                                }
                                value="24 May 2024"
                            />
                        </div>
                    </div>

                    {/* Submission Info */}
                    <div className={verifyBookingStyle.sectionCard}>
                        <h3 className={verifyBookingStyle.sectionTitle}>
                            <CheckCircle
                                className={verifyBookingStyle.sectionTitleIcon}
                            />
                            <AppText
                                textName="SUBMISSION_DETAILS"
                                textModule="LABEL"
                            />
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <p className={verifyBookingStyle.submittedOnTitle}>
                                    <AppText
                                        textName="SUBMITTED_ON"
                                        textModule="LABEL"
                                    />
                                </p>

                                <p className={verifyBookingStyle.submittedOnValue}>
                                    24 May 2025, 10:30 AM
                                </p>
                            </div>

                            <div>
                                <p
                                    className={
                                        verifyBookingStyle.additionalNotesTitle
                                    }
                                >
                                    <AppText
                                        textName="ADDITIONAL_NOTES"
                                        textModule="LABEL"
                                    />
                                </p>

                                <textarea
                                    readOnly
                                    value="Please review and approve the venue listing."
                                    className={verifyBookingStyle.textarea}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={verifyBookingStyle.footer}>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className={verifyBookingStyle.cancelBtn}
                    >
                        <AppText textName="CANCEL" textModule="BUTTON" />
                    </Button>

                    <Button className={verifyBookingStyle.primaryActionBtn}>
                        {actionType === "pay"
                            ? (
                                <AppText
                                    textName="PAY_NOW"
                                    textModule="BUTTON"
                                />
                            )
                            : (
                                <AppText
                                    textName="APPROVE_VENUE"
                                    textModule="BUTTON"
                                />
                            )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
