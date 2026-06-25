"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Users, Star, CalendarDays, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { VENUE_STATUS_STYLE, VENUE_STATUS_LABEL } from "./data";
import type { Venue } from "../app/actions/venue";

interface Props {
    venue: Venue | null;
    onClose: () => void;
}

export function VenueDetailModal({ venue, onClose }: Props) {
    const [imgIndex, setImgIndex] = useState(0);

    if (!venue) return null;

    const images = venue.images.length > 0 ? venue.images : [];
    const prev = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setImgIndex((i) => (i + 1) % images.length);

    return (
        <Dialog open={!!venue} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                {/* Image gallery */}
                {images.length > 0 ? (
                    <div className="relative w-full h-56 bg-muted overflow-hidden rounded-t-lg">
                        <Image
                            src={images[imgIndex]!}
                            alt={venue.name}
                            fill
                            className="object-cover"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-40 bg-muted rounded-t-lg flex items-center justify-center text-muted-foreground text-sm">
                        No images
                    </div>
                )}

                <div className="p-6 space-y-5">
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-3 pr-6">
                            <DialogTitle className="text-xl">{venue.name}</DialogTitle>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${VENUE_STATUS_STYLE[venue.status]}`}>
                                {VENUE_STATUS_LABEL[venue.status]}
                            </span>
                        </div>
                    </DialogHeader>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            {venue.rating > 0 ? venue.rating.toFixed(1) : "No ratings"}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            {venue.bookings} bookings
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4" />
                            Submitted {venue.submitted}
                        </span>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <InfoRow label="Owner" value={venue.owner} />
                        <InfoRow label="Category" value={venue.category} />
                        <InfoRow
                            label="Location"
                            value={
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    {venue.location}
                                </span>
                            }
                        />
                        <InfoRow label="District" value={venue.district} />
                        <InfoRow
                            label="Capacity"
                            value={
                                <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    {venue.capacity} guests
                                </span>
                            }
                        />
                    </div>

                    {/* Description */}
                    {venue.description && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Description
                            </p>
                            <p className="text-sm text-foreground/80 leading-relaxed">{venue.description}</p>
                        </div>
                    )}

                    {/* Amenities */}
                    {venue.amenities.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Amenities
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {venue.amenities.map((a) => (
                                    <span
                                        key={a}
                                        className="text-xs px-2.5 py-1 bg-muted text-muted-foreground rounded-full border border-border"
                                    >
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sessions */}
                    {venue.sessions.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Sessions
                            </p>
                            <div className="rounded-xl border border-border overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
                                            <th className="px-4 py-2.5 text-left font-semibold">Label</th>
                                            <th className="px-4 py-2.5 text-left font-semibold">Time</th>
                                            <th className="px-4 py-2.5 text-right font-semibold">Price</th>
                                            <th className="px-4 py-2.5 text-center font-semibold">Active</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {venue.sessions.map((s) => (
                                            <tr key={s.id} className="border-t border-border">
                                                <td className="px-4 py-2.5 font-medium">{s.label}</td>
                                                <td className="px-4 py-2.5 text-muted-foreground">
                                                    {s.startTime} – {s.endTime}
                                                </td>
                                                <td className="px-4 py-2.5 text-right font-semibold">
                                                    Rs. {s.price.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <span
                                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.isActive ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                                                    >
                                                        {s.isActive ? "Yes" : "No"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
        </div>
    );
}
