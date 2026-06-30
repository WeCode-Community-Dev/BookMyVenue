"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Loader2, MapPin, Sparkles, Star, Users } from "lucide-react";
import { useVenue } from "@/hooks/useVenues";
import { useBookingStore } from "@/stores/bookingStore";
import { Calendar } from "@/components/ui/calendar";
import { formatEnum } from "@/lib/utils";
import { useGetVenueReviewStatus } from "@/hooks/useReview";
import { useAuth } from "@clerk/nextjs";
import { ReviewModal } from "@/components/ReviewModal";
// import { GetVenueReviewStatusResponse } from "@bookmyvenue/types";

export default function VenueDetailsPage() {
    const [token, setToken] = useState("");
    const [activeImage, setActiveImage] = useState(0);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const { getToken } = useAuth();
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const { data, isLoading, error } = useVenue(params.id);
    const { data: reviewStatus } = useGetVenueReviewStatus(params.id, token);

    const selectedSessions = useBookingStore((s) => s.selectedSessions);
    const toggleSession = useBookingStore((s) => s.toggleSession);
    const selectedDate = useBookingStore((s) => s.selectedDate);
    const setSelectedDate = useBookingStore((s) => s.setSelectedDate);

    useEffect(() => {
        const fetchToken = async () => {
            const jwt = await getToken();
            setToken(jwt ?? "");
        };
        fetchToken();
    }, [getToken]);

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
    const images = venue.images.length ? venue.images : ["/placeholder-venue.jpg"];
    const mainImage = images[activeImage] ?? images[0] ?? "/placeholder-venue.jpg";

    return (
        <>
            <section className="py-10 bg-secondary/40 min-h-[70vh]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/venues"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All venues
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="relative h-80 sm:h-96 bg-muted rounded-2xl overflow-hidden">
                                <Image src={mainImage} alt={venue.name} fill className="object-cover" />
                                <span className="absolute top-4 left-4 bg-primary/80 backdrop-blur- text-white text-xs px-2.5 py-1 rounded-full">
                                    {formatEnum(venue.category)}
                                </span>
                            </div>

                            {images.length > 1 && (
                                <div className="flex gap-3 flex-wrap">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                                i === activeImage ? "border-primary" : "border-transparent"
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${venue.name} ${i + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div>
                                <h2 className="text-lg font-bold text-foreground mb-2">About this venue</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {venue.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold text-foreground">
                                        {venue.averageRating?.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        ({venue.reviewCount})
                                    </span>
                                </div>
                                <span className="text-border">·</span>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>{venue.capacity} guests</span>
                                </div>
                            </div>

                            {venue.amenities.length > 0 && (
                                <div>
                                    <h2 className="text-lg font-bold text-foreground mb-3">Amenities</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {venue.amenities.map((a) => (
                                            <span
                                                key={a}
                                                className="bg-card border border-border text-sm text-foreground px-3 py-1.5 rounded-full"
                                            >
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {reviewStatus?.reviewStatus === "CAN_REVIEW" && (
                                <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                                    <h3 className="text-base font-semibold text-foreground mb-2">
                                        Share your experience
                                    </h3>

                                    <button
                                        onClick={() => setReviewModalOpen(true)}
                                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        Rate & Write Review
                                    </button>
                                </div>
                            )}

                            <div>
                                <h2 className="text-lg font-bold text-foreground mb-3">
                                    Reviews ({venue.reviewCount})
                                </h2>
                                {venue.reviews.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No reviews yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {venue.reviews.map((r) => (
                                            <div
                                                key={r.id}
                                                className="bg-card border border-border rounded-xl p-4"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {r.rating}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {r.user.email}
                                                    </span>
                                                </div>
                                                {r.comment && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {r.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <aside className="lg:col-span-1">
                            <div className="bg-card border border-border rounded-2xl p-6 lg:sticky lg:top-24 space-y-5">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">
                                        {venue.name}
                                    </h1>
                                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        <span>
                                            {venue.location}, {formatEnum(venue.district)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-5">
                                    <h3 className="flex items-center gap-1.5 text-sm font-bold text-foreground mb-3">
                                        <CalendarDays className="w-4 h-4" />
                                        Select date
                                    </h3>
                                    <Calendar value={selectedDate} onChange={setSelectedDate} />
                                </div>

                                <div className="border-t border-border pt-5">
                                    <h3 className="text-sm font-bold text-foreground mb-3">Sessions</h3>
                                    {venue.sessions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No sessions available.
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {venue.sessions.map((s) => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => toggleSession(s.id)}
                                                    className={`w-full flex items-center justify-between border rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                                                        selectedSessions.includes(s.id)
                                                            ? "border-primary ring-1 ring-primary"
                                                            : "border-border hover:border-primary/50"
                                                    }`}
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">
                                                            {s.label}
                                                        </p>
                                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="w-3 h-3" />
                                                            {s.startTime} – {s.endTime}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-bold text-primary">
                                                        ₹{s.price.toLocaleString("en-IN")}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => router.push(`/venues/${venue.id}/book`)}
                                    disabled={
                                        venue.sessions.length === 0 ||
                                        !selectedDate ||
                                        selectedSessions.length === 0
                                    }
                                    className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Book Now
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
            <ReviewModal open={reviewModalOpen} onOpenChange={setReviewModalOpen} venueId={Number(params.id)} />
        </>
    );
}
