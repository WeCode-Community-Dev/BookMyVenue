"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    FileText,
    Loader2,
    MapPin,
    Phone,
    Sparkles,
    Users,
} from "lucide-react";
import { useVenue } from "@/hooks/useVenues";
import { useBookingStore } from "@/stores/bookingStore";
import { formatEnum, formatToDetailedDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCreateBooking } from "@/hooks/useCreateBooking";

const bookingSchema = z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    purpose: z
        .string()
        .trim()
        .min(3, "Please tell the owner what the booking is for")
        .max(300, "Purpose must be 300 characters or less"),
});

export default function VenueBookingPage() {
    const params = useParams<{ id: string }>();
    const { data, isLoading, error } = useVenue(params.id);

    const router = useRouter();
    const { mutate: createBooking, isPending } = useCreateBooking();

    const selectedSessions = useBookingStore((s) => s.selectedSessions);
    const selectedDate = useBookingStore((s) => s.selectedDate);
    const phone = useBookingStore((s) => s.phone);
    const setPhone = useBookingStore((s) => s.setPhone);
    const purpose = useBookingStore((s) => s.purpose);
    const setPurpose = useBookingStore((s) => s.setPurpose);
    const resetBooking = useBookingStore((state) => state.resetBooking);

    const [touched, setTouched] = useState<{ phone?: boolean; purpose?: boolean }>({});

    const validation = bookingSchema.safeParse({ phone, purpose });
    const fieldErrors = validation.success ? {} : z.flattenError(validation.error).fieldErrors;
    const phoneError = touched.phone ? fieldErrors.phone?.[0] : undefined;
    const purposeError = touched.purpose ? fieldErrors.purpose?.[0] : undefined;

    const handleConfirm = () => {
        if (!validation.success || !selectedDate || activeSessions.length === 0) return;

        createBooking(
            {
                venueId: venue.id,
                sessionIds: selectedSessions,
                eventDate: selectedDate,
                phone,
                purpose,
            },
            {
                onSuccess: () => {
                    resetBooking();
                    router.push(`/venues/${venue.id}/book/success`);
                },
                onError: (err) => {console.error(err)},
            },
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32 text-muted-foreground min-h-[70vh]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error || !data?.venue) {
        return (
            <div className="text-center py-32 text-muted-foreground min-h-[70vh]">
                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">Could not load this venue.</p>
                <Link
                    href="/venues"
                    className="mt-4 inline-block text-primary font-semibold text-sm hover:underline"
                >
                    Back to all venues
                </Link>
            </div>
        );
    }

    const venue = data.venue;
    const activeSessions = venue.sessions.filter((s) => selectedSessions.includes(s.id!));
    const total = activeSessions.reduce((sum, s) => sum + s.price, 0);
    const formattedDate = formatToDetailedDate(selectedDate) ?? null;

    return (
        <section className="py-10 bg-secondary/40 min-h-[70vh]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href={`/venues/${venue.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to venue
                </Link>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">
                        Book {venue.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {venue.location}, {formatEnum(venue.district)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            {venue.capacity} guests
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                    {/* Left: input fields */}
                    <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 space-y-6">
                        <h2 className="text-base font-bold text-foreground">Your details</h2>

                        <div>
                            <label
                                htmlFor="phone"
                                className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-3"
                            >
                                <Phone className="w-3.5 h-3.5 text-primary" />
                                Contact number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                                placeholder="10-digit mobile number"
                                className={`w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                                    phoneError
                                        ? "border-destructive focus:border-destructive focus:ring-destructive"
                                        : "border-border focus:border-primary focus:ring-primary"
                                }`}
                            />
                            {phoneError ? (
                                <p className="mt-1.5 text-xs text-destructive">{phoneError}</p>
                            ) : (
                                <p className="mt-1.5 text-xs text-muted-foreground">
                                    The venue owner will use this to reach you about your booking.
                                </p>
                            )}
                        </div>

                        <div className="border-t border-border pt-5">
                            <label
                                htmlFor="purpose"
                                className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-3"
                            >
                                <FileText className="w-3.5 h-3.5 text-primary" />
                                Purpose
                            </label>
                            <textarea
                                id="purpose"
                                rows={3}
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                onBlur={() => setTouched((t) => ({ ...t, purpose: true }))}
                                placeholder="e.g. Wedding reception, birthday party, corporate meeting"
                                className={`w-full resize-none rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                                    purposeError
                                        ? "border-destructive focus:border-destructive focus:ring-destructive"
                                        : "border-border focus:border-primary focus:ring-primary"
                                }`}
                            />
                            {purposeError ? (
                                <p className="mt-1.5 text-xs text-destructive">{purposeError}</p>
                            ) : (
                                <p className="mt-1.5 text-xs text-muted-foreground">
                                    Briefly tell the owner what the booking is for.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: booking details */}
                    <div className="lg:col-span-2 lg:sticky lg:top-6 bg-card border border-border rounded-2xl p-6 space-y-6">
                        <h2 className="text-base font-bold text-foreground">Booking details</h2>

                        <div>
                            <h3 className="text-sm font-bold text-foreground mb-3">Date</h3>
                            {!formattedDate ? (
                                <p className="text-sm text-muted-foreground">No date selected.</p>
                            ) : (
                                <p className="flex items-center gap-1.5 text-md font-medium text-foreground">
                                    <CalendarDays className="w-4 h-4 text-primary" />
                                    {formattedDate}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-border pt-5">
                            <h3 className="text-sm font-bold text-foreground mb-3">Sessions</h3>
                            {activeSessions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No sessions selected.</p>
                            ) : (
                                <div className="space-y-2">
                                    {activeSessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center justify-between border rounded-xl px-3 py-2.5"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {session.label}
                                                </p>
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    {session.startTime} – {session.endTime}
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold text-primary">
                                                ₹{session.price.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {activeSessions.length > 0 && (
                            <div className="border-t border-border pt-5 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <span className="text-lg font-bold text-foreground">
                                    ₹{total.toLocaleString("en-IN")}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handleConfirm}
                            disabled={
                                activeSessions.length === 0 ||
                                !formattedDate ||
                                !validation.success ||
                                isPending
                            }
                            className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
