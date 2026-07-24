/* eslint-disable */

import { AppText, getText } from "@/lib/language/LanguageHelper";
import {
    BadgeCheck,
    CalendarDays,
} from "lucide-react";
import { getVenuePrimaryImage, getVenueVerified } from "@/features/venues/services/VenuService";

import Image from "next/image";
import { Venue } from "@/types/Venue";
import { bookingSummaryStyle } from "@/features/booking/styles/BookingSummaryStyle";

export interface BookingItem {
    id: number | string;
    day: string;
    month: string;
    title: string;
    time: string;
    guests: string;
    price: number | string;
}

interface BookingSummaryProps {
    venue?: Venue | null;
    isProfileConfirmed?: boolean;
    onProceedToPayment?: () => void;
    bookings?: BookingItem[];
    isPaying?: boolean;
    paymentError?: string | null;
}

const mockBookings: BookingItem[] = [
    {
        id: 1,
        day: "15",
        month: "JUL",
        title: "Morning Wedding Package",
        time: "09:00 AM - 01:00 PM",
        guests: "50-150 Guests",
        price: 18000,
    },
    {
        id: 2,
        day: "16",
        month: "JUL",
        title: "Morning Wedding Package",
        time: "09:00 AM - 01:00 PM",
        guests: "50-150 Guests",
        price: 18000,
    },
    {
        id: 3,
        day: "17",
        month: "JUL",
        title: "Evening Reception Package",
        time: "04:00 PM - 10:00 PM",
        guests: "150-400 Guests",
        price: 30000,
    },
];

export default function BookingSummary({
    venue,
    isProfileConfirmed = false,
    onProceedToPayment,
    bookings,
    isPaying = false,
    paymentError = null,
}: BookingSummaryProps) {
    const activeBookings = bookings || mockBookings;
    
    // Calculate subtotal and grand total dynamically
    const subtotal = activeBookings.reduce((sum, item) => sum + Number(item.price), 0);
    const platformFee = 0; // free platform fee
    const grandTotal = subtotal + platformFee;

    const formattedCurrency = (value: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <section className={bookingSummaryStyle.card}>

            <div className={bookingSummaryStyle.p5}>

                {/* Heading */}

                <h2 className={bookingSummaryStyle.heading}>
                    <AppText textName="BOOKING_SUMMARY" textModule="LABEL" />
                </h2>

                {/* Venue */}

                <div className={bookingSummaryStyle.venueRow}>

                    <div className={bookingSummaryStyle.imageWrapper}>

                        <Image
                            src={venue ? getVenuePrimaryImage(venue) : "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1400&auto=format&fit=crop"}
                            alt={venue?.name || "Venue"}
                            width={84}
                            height={62}
                            className={bookingSummaryStyle.image}
                        />

                    </div>

                    <div className={bookingSummaryStyle.venueInfo}>

                        <h3 className={bookingSummaryStyle.venueName}>
                            {venue?.name || "Grand Palace Convention Centre"}
                        </h3>

                        {(!venue || getVenueVerified(venue)) && (
                            <div className={bookingSummaryStyle.verifiedRow}>

                                <BadgeCheck className={bookingSummaryStyle.verifiedIcon} />

                                <span className={bookingSummaryStyle.verifiedText}>
                                    <AppText textName="VERIFIED_VENUE" textModule="LABEL" />
                                </span>

                            </div>
                        )}

                    </div>

                </div>

                {/* Divider */}

                <div className={bookingSummaryStyle.divider} />

                {/* Booking Heading */}

                <h3 className={bookingSummaryStyle.subheading}>
                    <AppText textName="YOUR_BOOKING" textModule="LABEL" append={{ count: activeBookings.length }} />
                </h3>

                {/* Booking Items */}

                <div className={bookingSummaryStyle.itemsList}>

                    {activeBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className={bookingSummaryStyle.itemRow}
                        >

                            {/* Date */}

                            <div className={bookingSummaryStyle.dateBlock}>

                                <span className={bookingSummaryStyle.dateDay}>
                                    {booking.day}
                                </span>

                                <span className={bookingSummaryStyle.dateMonth}>
                                    {booking.month}
                                </span>

                            </div>

                            {/* Package */}

                            <div className={bookingSummaryStyle.itemContent}>

                                <h4 className={bookingSummaryStyle.itemTitle}>
                                    {booking.title}
                                </h4>

                                <div className={bookingSummaryStyle.itemTimeRow}>

                                    <CalendarDays className={bookingSummaryStyle.itemTimeIcon} />

                                    <span>
                                        {booking.time}
                                    </span>

                                </div>

                                <p className={bookingSummaryStyle.itemGuests}>
                                    {booking.guests}
                                </p>

                            </div>

                            {/* Price */}

                            <div className={bookingSummaryStyle.itemPriceWrapper}>

                                <span className={bookingSummaryStyle.itemPrice}>
                                    {formattedCurrency(Number(booking.price))}
                                </span>

                            </div>

                        </div>
                    ))}

                </div>
                {/* Divider */}

                <div className={bookingSummaryStyle.divider} />

                {/* Price Breakdown */}

                <h3 className={bookingSummaryStyle.subheading}>
                    <AppText textName="PRICE_BREAKDOWN" textModule="LABEL" />
                </h3>

                <div className={bookingSummaryStyle.priceBreakdownList}>

                    {activeBookings.map((booking) => (
                        <div key={booking.id} className={bookingSummaryStyle.rowSpaceBetween}>
                            <span className={bookingSummaryStyle.labelCol}>
                                {booking.title} ({booking.day} {booking.month})
                            </span>

                            <span className={bookingSummaryStyle.valCol}>
                                {formattedCurrency(Number(booking.price))}
                            </span>
                        </div>
                    ))}

                </div>

                {/* Dashed Divider */}

                <div className={bookingSummaryStyle.dividerDashed} />

                {/* Totals */}

                <div className={bookingSummaryStyle.totalsList}>

                    <div className={bookingSummaryStyle.rowSpaceBetween}>
                        <span className={bookingSummaryStyle.labelCol}>
                            <AppText textName="SUBTOTAL" textModule="LABEL" />
                        </span>

                        <span className={bookingSummaryStyle.valCol}>
                            {formattedCurrency(subtotal)}
                        </span>
                    </div>

                    <div className={bookingSummaryStyle.rowSpaceBetween}>
                        <span className={bookingSummaryStyle.labelCol}>
                            <AppText textName="PLATFORM_FEE" textModule="LABEL" />
                        </span>

                        <span className={bookingSummaryStyle.valColFree}>
                            <AppText textName="FREE" textModule="LABEL" />
                        </span>
                    </div>

                    <div className={bookingSummaryStyle.rowSpaceBetween}>
                        <span className={bookingSummaryStyle.labelCol}>
                            <AppText textName="TAXES" textModule="LABEL" />
                        </span>

                        <span className={bookingSummaryStyle.valColIncluded}>
                            <AppText textName="INCLUDED" textModule="LABEL" />
                        </span>
                    </div>

                </div>

                {/* Divider */}

                <div className={bookingSummaryStyle.divider} />

                {/* Grand Total */}

                <div className={bookingSummaryStyle.rowSpaceBetween}>

                    <div>

                        <p className={bookingSummaryStyle.grandTotalLabel}>
                            <AppText textName="GRAND_TOTAL" textModule="LABEL" />
                        </p>

                        <p className={bookingSummaryStyle.grandTotalSubtext}>
                            <AppText textName="INCLUDING_ALL_TAXES" textModule="LABEL" />
                        </p>

                    </div>

                    <span className={bookingSummaryStyle.grandTotalVal}>
                        {formattedCurrency(grandTotal)}
                    </span>

                </div>

                {/* Cancellation Policy */}

                <div className={bookingSummaryStyle.policyCard}>

                    <p className={bookingSummaryStyle.policyTitle}>
                        <AppText textName="CANCELLATION_POLICY" textModule="LABEL" />
                    </p>

                    <p className={bookingSummaryStyle.policyText}>
                        <AppText textName="CANCELLATION_POLICY_DESC" textModule="LABEL" />
                    </p>

                </div>

                {/* Payment Error */}
                {paymentError && (
                    <div className={bookingSummaryStyle.errorCard}>
                        {paymentError}
                    </div>
                )}

                {/* Payment Button */}

                <button
                    type="button"
                    onClick={onProceedToPayment}
                    disabled={!isProfileConfirmed || isPaying}
                    className={(isProfileConfirmed && !isPaying) ? bookingSummaryStyle.payBtnActive : bookingSummaryStyle.payBtnDisabled}
                >
                    {isPaying ? (
                        <div className={bookingSummaryStyle.loadingWrapper}>
                            <div className={bookingSummaryStyle.spinner} />
                            <AppText textName="PROCESSING" textModule="BUTTON" />
                        </div>
                    ) : !isProfileConfirmed ? (
                        <AppText textName="CONFIRM_DETAILS_FIRST" textModule="BUTTON" />
                    ) : (
                        <AppText textName="PROCEED_SECURE_PAYMENT" textModule="BUTTON" />
                    )}
                </button>

                {/* Footer */}

                <p className={bookingSummaryStyle.footerText}>
                    <AppText textName="POWERED_SECURELY_BY" textModule="LABEL" />
                    <span className={bookingSummaryStyle.footerBrand}>
                        Razorpay
                    </span>
                </p>

            </div>
        </section>
    );
}