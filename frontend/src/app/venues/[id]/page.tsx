"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import BookingModal from "@/components/BookingModal";
import { getVenueById } from "@/lib/venues";
import { formatPrice } from "@/lib/bookings";

const CATEGORY_COLORS: Record<string, string> = {
  Conference: "#6366f1",
  Wedding:    "#ec4899",
  Party:      "#f59e0b",
  Outdoor:    "#10b981",
  Workshop:   "#3b82f6",
  Exhibition: "#8b5cf6",
  Sports:     "#14b8a6",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: "1rem", color: s <= Math.round(rating) ? "#fbbf24" : "var(--text-muted)" }}>
          ★
        </span>
      ))}
      <span style={{ fontWeight: 700, color: "var(--text-primary)", marginLeft: "0.25rem" }}>{rating.toFixed(1)}</span>
      <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>({count} reviews)</span>
    </div>
  );
}

function VenueDetailContent({ id }: { id: string }) {
  const venue = getVenueById(id);
  const [showModal, setShowModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!venue) notFound();

  const accentColor = CATEGORY_COLORS[venue.category] ?? "#6366f1";

  function handleSuccess() {
    setShowModal(false);
    setBookingSuccess(true);
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
        <Link href="/venues" style={{ color: "var(--accent-400)" }}>Venues</Link>
        <span>›</span>
        <span>{venue.name}</span>
      </nav>

      {/* Booking success banner */}
      {bookingSuccess && (
        <div
          style={{
            background: "rgba(52,211,153,0.12)",
            border: "1px solid rgba(52,211,153,0.35)",
            borderRadius: "var(--radius-md)",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            animation: "fadeInUp 0.3s ease",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>🎉</span>
          <div>
            <p style={{ fontWeight: 600, color: "var(--success)" }}>Booking Confirmed!</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Your booking at <strong>{venue.name}</strong> has been confirmed.{" "}
              <Link href="/my-bookings" style={{ color: "var(--accent-400)" }}>View My Bookings →</Link>
            </p>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(360px, 100%)", gap: "2rem", alignItems: "start" }}>
        {/* Left — main content */}
        <div style={{ minWidth: 0 }}>
          {/* Hero image */}
          <div
            style={{
              position: "relative",
              height: "380px",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              marginBottom: "2rem",
            }}
          >
            <Image
              src={venue.images[0]}
              alt={venue.name}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Category overlay */}
            <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
              <span
                className="badge"
                style={{
                  background: `${accentColor}25`,
                  color: accentColor,
                  border: `1px solid ${accentColor}55`,
                  backdropFilter: "blur(8px)",
                  fontSize: "0.8125rem",
                  padding: "0.3rem 0.75rem",
                }}
              >
                {venue.category}
              </span>
            </div>
          </div>

          {/* Title & rating */}
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}
          >
            {venue.name}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
            <StarRating rating={venue.rating} count={venue.reviewCount} />
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              📍 {venue.location}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              👥 Up to {venue.capacity} guests
            </span>
          </div>

          {/* Description */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
              About this venue
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: "0.95rem" }}>
              {venue.description}
            </p>
          </div>

          {/* Highlights */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>
              Highlights
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {venue.highlights.map((h) => (
                <div key={h} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.925rem", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--success)", fontSize: "0.9rem" }}>✓</span>
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>
              Amenities
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
              {venue.amenities.map((a) => (
                <span
                  key={a}
                  style={{
                    padding: "0.375rem 0.875rem",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "9999px",
                    fontSize: "0.8375rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — sticky booking sidebar */}
        <div style={{ position: "sticky", top: "80px" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-xl)",
              padding: "1.75rem",
              boxShadow: "var(--shadow-card), var(--shadow-glow)",
            }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                Starting from
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem", marginTop: "0.25rem" }}>
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #f0f2ff, #a5b4fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {formatPrice(venue.pricePerHour)}
                </span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>/hour</span>
              </div>
            </div>

            {/* Key info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
              }}
            >
              {[
                { icon: "📍", label: "Location", value: venue.city },
                { icon: "👥", label: "Capacity", value: `${venue.capacity} guests` },
                { icon: "⭐", label: "Rating", value: `${venue.rating}/5 (${venue.reviewCount} reviews)` },
                { icon: "🏷️", label: "Category", value: venue.category },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--text-secondary)", display: "flex", gap: "0.35rem", alignItems: "center" }}>
                    <span>{item.icon}</span>{item.label}
                  </span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>

            <button
              id="book-now-btn"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
              style={{ width: "100%", padding: "0.875rem", fontSize: "1.0625rem" }}
            >
              Book Now →
            </button>

            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.875rem" }}>
              Free cancellation · No booking fees
            </p>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {showModal && (
        <BookingModal
          venue={venue}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default function VenueDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <VenueDetailContent id={id} />
    </AuthGuard>
  );
}
