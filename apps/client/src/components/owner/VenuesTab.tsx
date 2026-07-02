"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useOwnerVenues } from "@/hooks/useVenues";
import { Venue } from "@bookmyvenue/types";
import VenueModal from "./VenueModal";

const STATUS_STYLE = {
    APPROVED: "bg-emerald-200 text-emerald-700 border-emerald-700",
    PENDING: "bg-amber-200 text-amber-700 border-amber-700",
    REJECTED: "bg-red-200 text-red-600 border-red-700",
} as const;

export default function VenuesTab() {
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [token, setToken] = useState("");
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchToken = async () => {
            const jwt = await getToken();
            setToken(jwt ?? "");
        };
        fetchToken();
    }, [getToken]);

    const { data, isLoading, error } = useOwnerVenues({ page: 1, limit: 20 }, token);

    const venues = data?.venues ?? [];

    if (isLoading) {
        return <div className="flex justify-center py-10">Loading venues...</div>;
    }

    if (error) {
        return <div className="flex justify-center py-10 text-red-500">{(error as Error).message}</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted-foreground">{venues.length} venues listed</p>
            </div>

            {venues.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                    No venues found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {venues.map((v) => (
                        <div
                            key={v.id}
                            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            <div className="relative h-44 bg-muted overflow-hidden">
                                <Image
                                    src={v.images[0]!}
                                    alt={v.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                                    <span
                                        className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                                            STATUS_STYLE[v.verificationStatus!]
                                        }`}
                                    >
                                        {v.verificationStatus?.toLocaleLowerCase()}
                                    </span>

                                    {!v.isActive && (
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-700 text-white">
                                            Inactive
                                        </span>
                                    )}
                                </div>

                                {v.averageRating && (
                                    <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        {v.averageRating.toFixed(1)}
                                    </span>
                                )}

                                {v.verificationStatus === "REJECTED" && v.verificationReason && (
                                    <div className="absolute bottom-0 left-0 right-0  rounded-lg border border-red-200 bg-red-50 p-3">
                                        <p className="text-xs font-semibold text-red-600">Venue Rejected:</p>
                                        <p className="mt-1 text-xs text-red-500">{v.verificationReason}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-base mb-1">{v.name}</h3>

                                <div className="text-muted-foreground text-xs mb-4">
                                    <div className="flex items-center gap-1 ">
                                        <MapPin className="w-3 h-3 " />
                                        <span>{v.location}</span>
                                    </div>
                                    <span className="ps-4">{v.category}</span>
                                </div>
                                {/* {v.verificationStatus === "REJECTED" && v.verificationReason && (
                                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                                        <p className="text-xs font-semibold text-red-600">
                                            Verification Rejected
                                        </p>
                                        <p className="mt-1 text-xs text-red-500">{v.verificationReason}</p>
                                    </div>
                                )} */}

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="bg-muted rounded-lg p-2 text-center">
                                        <p className="text-xs font-bold">{v.capacity}</p>
                                        <p className="text-xs text-muted-foreground">Capacity</p>
                                    </div>

                                    <div className="bg-muted rounded-lg p-2 text-center">
                                        <p className="text-xs font-bold">
                                            {v.sessions.length > 0
                                                ? "₹" +
                                                  Math.min(...v.sessions.map((s) => s.price)).toLocaleString()
                                                : "-"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Starting</p>
                                    </div>

                                    <div className="bg-muted rounded-lg p-2 text-center">
                                        <p className="text-xs font-bold">{v?.bookingCount}</p>
                                        <p className="text-xs text-muted-foreground">Bookings</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-border">
                                    <button
                                        onClick={() => setEditingVenue(v)}
                                        disabled={v.verificationStatus === "PENDING"}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground bg-muted hover:bg-secondary rounded-lg py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg py-2 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {editingVenue && (
                <VenueModal mode="EDIT" venue={editingVenue} onClose={() => setEditingVenue(null)} />
            )}
        </div>
    );
}
