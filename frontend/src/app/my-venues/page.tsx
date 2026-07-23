"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
import DeleteVenueDialog from "@/components/DeleteVenueDialog";
import { fetchMyVenues, deleteVenue } from "@/lib/venues";
import { formatPrice } from "@/lib/bookings";
import type { Venue } from "@/lib/venues";

function MyVenuesContent() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [error, setError] = useState("");

    function load() {
        setLoading(true);
        fetchMyVenues()
            .then((res) => {
                if (res) {
                    setVenues(res)
                } else {
                    setVenues([])
                }
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }

    useEffect(load, []);

    async function handleDelete(id: string) {
        try {
            await deleteVenue(id);
            setVenues((prev) => prev.filter((v) => v.id !== id));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to delete venue");
        }
        setDeleteId(null);
    }

    if (loading) {
        return (
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
                <div className="skeleton" style={{ height: "36px", width: "200px", marginBottom: "1.5rem" }} />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: "120px", marginBottom: "1rem", borderRadius: "var(--radius-md)" }} />
                ))}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                        My Venues
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
                        Manage your venue listings
                    </p>
                </div>
                <Link href="/venues/new" className="btn btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.9rem" }}>
                    + Add Venue
                </Link>
            </div>

            {error && (
                <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", marginBottom: "1.5rem", color: "var(--error)", fontSize: "0.9rem" }}>
                    {error}
                </div>
            )}

            {!loading && venues?.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-secondary)" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏟️</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                        No venues yet
                    </h3>
                    <p style={{ marginBottom: "1.5rem" }}>Create your first venue listing to start accepting bookings.</p>
                    <Link href="/venues/new" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
                        + Add Your First Venue
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {venues.map((venue) => (
                        <div
                            key={venue.id}
                            style={{
                                display: "flex",
                                gap: "1.25rem",
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-card)",
                                borderRadius: "var(--radius-lg)",
                                overflow: "hidden",
                                animation: "fadeInUp 0.3s ease",
                            }}
                        >
                            <div style={{ position: "relative", width: "180px", minHeight: "130px", flexShrink: 0 }}>
                                <Image
                                    src={venue.images?.[0] ?? "/placeholder.svg"}
                                    alt={venue.name}
                                    fill
                                    sizes="180px"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div style={{ flex: 1, padding: "1rem 1rem 1rem 0", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{venue.name}</h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                    📍 {venue.location}{venue.city ? `, ${venue.city}` : ""}
                                </p>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                    👥 Up to {venue.capacity} guests · {formatPrice(venue.price_per_hour)}/hr
                                </p>
                                <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem", paddingTop: "0.5rem" }}>
                                    <Link href={`/venues/${venue.id}/edit`} className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "0.35rem 0.875rem" }}>
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setDeleteId(venue.id)}
                                        style={{ fontSize: "0.8rem", padding: "0.35rem 0.875rem", color: "var(--error)" }}
                                    >
                                        Delete
                                    </button>
                                    <Link href={`/venues/${venue.id}`} style={{ fontSize: "0.8rem", padding: "0.35rem 0.875rem", color: "var(--accent-400)", marginLeft: "auto", alignSelf: "center" }}>
                                        View →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteId && (
                <DeleteVenueDialog
                    venueId={deleteId}
                    onConfirm={() => handleDelete(deleteId)}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
}

export default function MyVenuesPage() {
    return (
        <AuthGuard>
            <MyVenuesContent />
        </AuthGuard>
    );
}
