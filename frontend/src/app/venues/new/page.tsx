"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import VenueForm from "@/components/VenueForm";
import { createVenue } from "@/lib/venues";
import type { CreateVenueInput } from "@/lib/venues";

function NewVenueContent() {
  const router = useRouter();

  async function handleSubmit(data: CreateVenueInput) {
    const venue = await createVenue(data);
    router.push(`/venues/${venue.id}`);
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <nav style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
        <Link href="/my-venues" style={{ color: "var(--accent-400)" }}>My Venues</Link>
        <span>›</span>
        <span>Add Venue</span>
      </nav>

      <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
        Add Venue
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        List a new space for events and bookings
      </p>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-xl)", padding: "1.75rem" }}>
        <VenueForm onSubmit={handleSubmit} submitLabel="Create Venue" />
      </div>
    </div>
  );
}

export default function NewVenuePage() {
  return (
    <AuthGuard>
      <NewVenueContent />
    </AuthGuard>
  );
}
