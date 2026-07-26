/* eslint-disable */
"use client";

import { AppText, getText } from "@/lib/language/LanguageHelper";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import BookingCalendar from "./BookingCalender";
import BookingExtras from "./BookingExtras";
import BookingHeader from "./BookingHeader";
import BookingPackages from "./BookingPackages";
import BookingSummary from "./BookingSummary";
import BookingVenueCard from "./BookingVenueCard";
import ReservationStatus from "./ReservationStatus";
import { SCREENS } from "@/lib/Constants";
import UserProfileForm from "./UserProfileForm";
import { Venue } from "@/types/Venue";
import { bookingLayoutStyle } from "@/features/booking/styles/BookingPageStyle";
import { format } from "date-fns";
import { getVenueById } from "@/features/venues/services/VenuService";
import { useAuthService } from "@/features/auth/services/AuthService";

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === "undefined") {
            resolve(false);
            return;
        }
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function BookingLayout() {
    const searchParams = useSearchParams();
    const venueId = searchParams.get("venueId");

    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProfileConfirmed, setIsProfileConfirmed] = useState(false);

    const router = useRouter();
    const { user, apiFetch } = useAuthService();

    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const [isPaying, setIsPaying] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [idempotencyKey, setIdempotencyKey] = useState<string>("");

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    useEffect(() => {
        setIdempotencyKey(generateUUID());
    }, [selectedDates, venueId]);

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

    const handleProceedToPayment = async () => {
        if (!isProfileConfirmed || !venue) return;

        setIsPaying(true);
        setPaymentError(null);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error("Failed to load Razorpay payment SDK.");
            }

            // Map selected dates to slot pricing tiers
            const slots = selectedDates.map((date, idx) => {
                const slotsCount = venue?.slotTemplates?.length || 0;
                const slot = slotsCount > 0 ? venue?.slotTemplates?.[idx % slotsCount] : null;
                const pricingTierId = slot?.pricingTiers?.[0]?.id;

                if (!pricingTierId) {
                    throw new Error("No slot pricing tier found for a selected date.");
                }

                return {
                    slotPricingTierId: pricingTierId,
                    eventDate: format(date, "yyyy-MM-dd"),
                };
            });

            // Create booking
            const bookingResponse = await apiFetch("/booking", {
                method: "POST",
                headers: {
                    "idempotency-key": idempotencyKey,
                },
                body: JSON.stringify({
                    venueId: venue.id,
                    slots,
                }),
            });

            if (!bookingResponse || !bookingResponse.razorpayOrderId) {
                throw new Error("Failed to initialize booking on the server.");
            }

            const { razorpayOrderId, amount, currency } = bookingResponse;
            const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

            // Trigger Razorpay payment popup
            const options = {
                key: keyId,
                amount: amount * 100, // in paise
                currency: currency || "INR",
                name: "BookMyVenue",
                description: `Booking payment for ${venue.name}`,
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        setIsPaying(true);
                        const verificationResponse = await apiFetch("/booking/verify-payment", {
                            method: "POST",
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id || razorpayOrderId,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            }),
                        });

                        if (verificationResponse && verificationResponse.success) {
                            router.push(SCREENS.BOOKINGS);
                        } else {
                            throw new Error("Payment verification failed.");
                        }
                    } catch (verifyErr: any) {
                        console.error("Verification failed:", verifyErr);
                        setPaymentError(verifyErr.message || "Payment verification failed.");
                        setIsPaying(false);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || "",
                },
                theme: {
                    color: "#0f766e",
                },
                modal: {
                    ondismiss: function () {
                        setIsPaying(false);
                    },
                },
            };

            const rzp = new (window as any).Razorpay(options);
            
            rzp.on("payment.failed", function (resp: any) {
                console.error("Payment failed:", resp.error);
                setPaymentError(resp.error.description || "Payment failed. Please try again.");
                setIsPaying(false);
            });

            rzp.open();
        } catch (err: any) {
            console.error("Proceed to payment error:", err);
            setPaymentError(err.message || "An unexpected error occurred during payment checkout.");
            setIsPaying(false);
        }
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
                            isPaying={isPaying}
                            paymentError={paymentError}
                        />

                        <ReservationStatus selectedDates={selectedDates} venueName={venue?.name} />

                    </div>

                </div>

            </div>
        </main>
    );
}