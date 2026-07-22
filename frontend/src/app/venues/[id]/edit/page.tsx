"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import VenueForm from "@/components/VenueForm";
import { fetchVenueById, updateVenue } from "@/lib/venues";
import type { CreateVenueInput } from "@/lib/venues";

interface PageProps {
  params: Promise<{ id: string }>;
}

function EditVenueContent({ id }: { id: string }) {
  const router = useRouter();
  const [initial, setInitial] = useState<CreateVenueInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenueById(id)
      .then((v) =>
        setInitial({
          name: v.name,
          description: v.description,
          location: v.location,
          city: v.city,
          category: v.category,
          capacity: v.capacity,
          price_per_hour: v.price_per_hour,
          images: v.images,
          amenities: v.amenities,
          highlights: v.highlights,
        })
      )
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data: CreateVenueInput) {
    await updateVenue(id, data);
    router.push(`/venues/${id}`);
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <div className="skeleton" style={{ height: "36px", width: "200px", marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: "500px", borderRadius: "var(--radius-xl)" }} />
      </div>
    );
  }

  if (!initial) return null;

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <nav style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
        <Link href="/my-venues" style={{ color: "var(--accent-400)" }}>My Venues</Link>
        <span>›</span>
        <Link href={`/venues/${id}`} style={{ color: "var(--accent-400)" }}>{initial.name}</Link>
        <span>›</span>
        <span>Edit</span>
      </nav>

      <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
        Edit Venue
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        Update your venue details
      </p>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-xl)", padding: "1.75rem" }}>
        <VenueForm initial={initial} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}

export default function EditVenuePage({ params }: PageProps) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <EditVenueContent id={id} />
    </AuthGuard>
  );
}
