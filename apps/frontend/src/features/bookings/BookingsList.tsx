/* eslint-disable */
"use client";

import { AlertCircle, BadgeCheck, CalendarDays, Clock, MapPin, RefreshCw, XCircle } from "lucide-react";
import { AppText, getText } from "@/lib/language/LanguageHelper";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { UserBooking } from "@/types/Booking";
import { bookingsListStyle } from "@/features/booking/styles/BookingsListStyle";
import { format } from "date-fns";
import { getUserBookings } from "./services/BookingService";

export default function BookingsList() {
    const [bookings, setBookings] = useState<UserBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserBookings();
            setBookings(data);
        } catch (err: any) {
            setError(err.message || getText("FAILED_TO_LOAD_BOOKINGS", "MESSAGES"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const formattedCurrency = (value: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getStatusStyle = (status: UserBooking["status"]) => {
        switch (status) {
            case "CONFIRMED":
                return `${bookingsListStyle.statusBadge} ${bookingsListStyle.statusConfirmed}`;
            case "PENDING_PAYMENT":
                return `${bookingsListStyle.statusBadge} ${bookingsListStyle.statusPending}`;
            case "CANCELLED":
                return `${bookingsListStyle.statusBadge} ${bookingsListStyle.statusCancelled}`;
            case "REFUNDED":
                return `${bookingsListStyle.statusBadge} ${bookingsListStyle.statusCancelled}`;
            case "EXPIRED":
            default:
                return `${bookingsListStyle.statusBadge} ${bookingsListStyle.statusExpired}`;
        }
    };

    const getStatusTextKey = (status: UserBooking["status"]) => {
        switch (status) {
            case "CONFIRMED":
                return "STATUS_CONFIRMED";
            case "PENDING_PAYMENT":
                return "STATUS_PENDING_PAYMENT";
            case "CANCELLED":
                return "STATUS_CANCELLED";
            case "REFUNDED":
                return "STATUS_REFUNDED";
            case "EXPIRED":
            default:
                return "STATUS_EXPIRED";
        }
    };

    const getStatusIcon = (status: UserBooking["status"]) => {
        switch (status) {
            case "CONFIRMED":
                return <BadgeCheck className="h-3.5 w-3.5" />;
            case "PENDING_PAYMENT":
                return <Clock className="h-3.5 w-3.5" />;
            case "CANCELLED":
            case "REFUNDED":
                return <XCircle className="h-3.5 w-3.5" />;
            case "EXPIRED":
            default:
                return <AlertCircle className="h-3.5 w-3.5" />;
        }
    };

    if (loading) {
        return (
            <main className={bookingsListStyle.loadingWrapper}>
                <div className={bookingsListStyle.loadingContainer}>
                    <div className={bookingsListStyle.spinner} />
                    <p className={bookingsListStyle.loadingText}>
                        <AppText textName="LOADING_BOOKING_DETAILS" textModule="MESSAGES" />
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className={bookingsListStyle.pageWrapper}>
            <div className={bookingsListStyle.container}>
                {/* Header */}
                <div className={bookingsListStyle.header}>
                    <h1 className={bookingsListStyle.title}>
                        <AppText textName="MY_BOOKINGS_TITLE" textModule="LABEL" />
                    </h1>
                    <p className={bookingsListStyle.subtitle}>
                        <AppText textName="MY_BOOKINGS_SUBTITLE" textModule="LABEL" />
                    </p>
                </div>

                {/* Error Box */}
                {error && (
                    <div className={bookingsListStyle.errorAlert}>
                        <span>{error}</span>
                        <button onClick={loadBookings} className={bookingsListStyle.retryBtn}>
                            <RefreshCw className="h-4 w-4" />
                            <AppText textName="RETRY" textModule="BUTTON" />
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!error && bookings.length === 0 ? (
                    <div className={bookingsListStyle.emptyWrapper}>
                        <h3 className={bookingsListStyle.emptyTitle}>
                            <AppText textName="NO_BOOKINGS_FOUND" textModule="MESSAGES" />
                        </h3>
                        <p className={bookingsListStyle.emptyText}>
                            <AppText textName="START_EXPLORING_VENUES" textModule="MESSAGES" />
                        </p>
                        <Link href="/venues" className={bookingsListStyle.exploreBtn}>
                            <AppText textName="EXPLORE_VENUES" textModule="BUTTON" />
                        </Link>
                    </div>
                ) : (
                    /* Bookings List Cards */
                    <div className={bookingsListStyle.cardList}>
                        {bookings.map((booking) => {
                            const primaryImage = booking.venue.images?.find((img) => img.isPrimary)?.url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1400&auto=format&fit=crop";

                            return (
                                <div key={booking.id} className={bookingsListStyle.card}>
                                    <div className={bookingsListStyle.cardHeader}>
                                        <div className={bookingsListStyle.venueInfo}>
                                            <div className={bookingsListStyle.imageWrapper}>
                                                <img
                                                    src={primaryImage}
                                                    alt={booking.venue.name}
                                                    className={bookingsListStyle.image}
                                                />
                                            </div>
                                            <div className={bookingsListStyle.venueDetails}>
                                                <Link
                                                    href={`/venues#venueId=${booking.venue.id}`}
                                                    className={bookingsListStyle.venueName}
                                                >
                                                    {booking.venue.name}
                                                </Link>
                                                <p className={bookingsListStyle.venueAddress}>
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    <span>{booking.venue.addressLine}, {booking.venue.city}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    <AppText textName="BOOKED_ON" textModule="LABEL" />: {format(new Date(booking.createdAt), "dd MMM yyyy, hh:mm a")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <span className={getStatusStyle(booking.status)}>
                                                {getStatusIcon(booking.status)}
                                                <AppText textName={getStatusTextKey(booking.status)} textModule="LABEL" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className={bookingsListStyle.divider} />

                                    {/* Booked Slots */}
                                    <div className={bookingsListStyle.slotsSection}>
                                        <h4 className={bookingsListStyle.slotsTitle}>
                                            <AppText textName="BOOKED_SLOTS" textModule="LABEL" />
                                        </h4>
                                        <div className={bookingsListStyle.slotsGrid}>
                                            {booking.slots.map((slot) => {
                                                const eventDate = new Date(slot.eventDate);
                                                return (
                                                    <div key={slot.id} className={bookingsListStyle.slotItem}>
                                                        <div className={bookingsListStyle.slotDateBlock}>
                                                            <span className={bookingsListStyle.slotDay}>
                                                                {format(eventDate, "dd")}
                                                            </span>
                                                            <span className={bookingsListStyle.slotMonth}>
                                                                {format(eventDate, "MMM").toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className={bookingsListStyle.slotMeta}>
                                                            <p className={bookingsListStyle.slotTitle}>
                                                                {slot.slotTemplate.label}
                                                            </p>
                                                            <p className={bookingsListStyle.slotTime}>
                                                                {slot.slotTemplate.startTime} - {slot.slotTemplate.endTime}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Card Footer with Price Details */}
                                    <div className={bookingsListStyle.cardFooter}>
                                        <div>
                                            <p className={bookingsListStyle.totalLabel}>
                                                <AppText textName="TOTAL_PAID" textModule="LABEL" />
                                            </p>
                                            <p className={bookingsListStyle.totalVal}>
                                                {formattedCurrency(Number(booking.totalPrice))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
