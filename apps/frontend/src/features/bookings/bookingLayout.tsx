/* eslint-disable */
"use client";

import { AppText, getText } from "@/lib/language/LanguageHelper";
import { useEffect, useState } from "react";

import BookingCalendar from "./BookingCalender";
import BookingExtras from "./BookingExtras";
import BookingHeader from "./BookingHeader";
import BookingPackages from "./BookingPackages";
import BookingSummary from "./BookingSummary";
import BookingVenueCard from "./BookingVenueCard";
import ReservationStatus from "./ReservationStatus";
import UserProfileForm from "./UserProfileForm";
import { Venue } from "@/types/Venue";
import { bookingLayoutStyle } from "@/features/booking/styles/BookingPageStyle";
import { getVenueById } from "@/features/venues/services/VenuService";
import { useSearchParams } from "next/navigation";

import { format } from "date-fns";

export default function BookingLayout() {
    const searchParams = useSearchParams();
    const venueId = searchParams.get("venueId");

    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProfileConfirmed, setIsProfileConfirmed] = useState(false);

    const [selectedDates, setSelectedDates] = useState<Date[]>([
        new Date(2026, 6, 15),
        new Date(2026, 6, 16),
        new Date(2026, 6, 17),
    ]);

    useEffect(() => {
        if (!venueId) {
            setError(getText("NO_VENUE_SELECTED", "MESSAGES"));
            setLoading(false);
            return;
        }

        const getVenue = async () => {
            try {
                setLoading(true);
                const data = await getVenueById(venueId);
                setVenue(data);
            } catch (err: any) {
                setError(err.message || getText("FAILED_TO_LOAD_VENUE", "MESSAGES"));
            } finally {
                setLoading(false);
            }
        };

        getVenue();
    }, [venueId]);

    const handleConfirmProfile = (confirmed: boolean) => {
        setIsProfileConfirmed(confirmed);
    };

    const handleProceedToPayment = () => {
        if (!isProfileConfirmed) return;
        alert(
            getText("PROCEEDING_TO_PAYMENT", "MESSAGES", {
                name: venue?.name || getText("SELECTED_VENUE", "MESSAGES"),
            })
        );
    };

    // Calculate dynamic bookings list
    const derivedBookings = selectedDates.map((date, idx) => {
        const slotsCount = venue?.slotTemplates?.length || 0;
        const slot = slotsCount > 0 ? venue?.slotTemplates?.[idx % slotsCount] : null;
        
        const slotLabel = slot?.label || (idx % 2 === 0 ? "Morning Wedding Package" : "Evening Reception Package");
        const slotTime = slot ? `${slot.startTime} - ${slot.endTime}` : (idx % 2 === 0 ? "09:00 AM - 01:00 PM" : "04:00 PM - 10:00 PM");
        const priceVal = slot?.pricingTiers?.[0]?.price 
            ? Number(slot.pricingTiers[0].price) 
            : (idx % 2 === 0 ? 18000 : 30000);

        return {
            id: date.toISOString() + idx,
            day: format(date, "dd"),
            month: format(date, "MMM").toUpperCase(),
            title: slotLabel,
            time: slotTime,
            guests: `${venue?.capacityMin || 50}-${venue?.capacityMax || 150} Guests`,
            price: priceVal,
        };
    });

    if (loading) {
        return (
            <main className={bookingLayoutStyle.loadingWrapper}>
                <div className={bookingLayoutStyle.loadingContainer}>
                    <div className={bookingLayoutStyle.spinner} />
                    <p className={bookingLayoutStyle.loadingText}>
                        <AppText textName="LOADING_BOOKING_DETAILS" textModule="MESSAGES" />
                    </p>
                </div>
            </main>
        );
    }

    if (error || !venue) {
        return (
            <main className={bookingLayoutStyle.errorWrapper}>
                <div className={bookingLayoutStyle.errorCard}>
                    <p className={bookingLayoutStyle.errorTitle}>
                        <AppText textName="ERROR_LOADING_BOOKING" textModule="MESSAGES" />
                    </p>
                    <p className={bookingLayoutStyle.errorText}>
                        {error || <AppText textName="VENUE_NOT_FOUND" textModule="MESSAGES" />}
                    </p>
                    <button 
                        onClick={() => window.history.back()}
                        className={bookingLayoutStyle.goBackButton}
                    >
                        <AppText textName="GO_BACK" textModule="BUTTON" />
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className={bookingLayoutStyle.pageWrapper}>
            <div className={bookingLayoutStyle.contentContainer}>

                <BookingHeader currentStep={1} />

                <div className={bookingLayoutStyle.layoutGrid}>

                    {/* LEFT */}

                    <div className={bookingLayoutStyle.leftSection}>

                        <BookingVenueCard venue={venue} />

                        <UserProfileForm onConfirmProfile={handleConfirmProfile} />

                        <BookingCalendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />

                        <BookingPackages selectedDates={selectedDates} />

                        <BookingExtras />

                    </div>

                    {/* RIGHT */}

                    <div className={bookingLayoutStyle.rightSection}>

                        <BookingSummary 
                            venue={venue} 
                            isProfileConfirmed={isProfileConfirmed} 
                            onProceedToPayment={handleProceedToPayment}
                            bookings={derivedBookings}
                        />

                        <ReservationStatus />

                    </div>

                </div>

            </div>
        </main>
    );
}