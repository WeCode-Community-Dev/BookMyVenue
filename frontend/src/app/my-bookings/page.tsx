"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { getMyBookings, cancelBooking, formatPrice } from "@/lib/bookings";
import type { Booking } from "@/lib/bookings";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", className: "badge-success", icon: "✓" },
  pending:   { label: "Pending",   className: "badge-warning", icon: "⏳" },
  cancelled: { label: "Cancelled", className: "badge-error",   icon: "✕" },
};

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
  const status = STATUS_CONFIG[booking.status];
  const [cancelling, setCancelling] = useState(false);

  function handleCancel() {
    setCancelling(true);
    setTimeout(() => {
      cancelBooking(booking.id);
      onCancel(booking.id);
      setCancelling(false);
    }, 500);
  }

  const formattedDate = new Date(booking.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s",
        animation: "fadeInUp 0.3s ease",
      }}
    >
      <div style={{ display: "flex", gap: "0", flexDirection: "row" }}>
        {/* Venue thumbnail */}
        <div style={{ position: "relative", width: "160px", minWidth: "160px", flexShrink: 0 }}>
          <Image
            src={booking.venueImage}
            alt={booking.venueName}
            fill
            sizes="160px"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {booking.venueName}
              </h3>
              <p style={{ fontSize: "0.8375rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                📍 {booking.venueLocation}
              </p>
            </div>
            <span className={`badge ${status.className}`}>
              {status.icon} {status.label}
            </span>
          </div>

          {/* Details row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            <span>📅 {formattedDate}</span>
            <span>🕐 {booking.startTime} – {booking.endTime}</span>
            <span>👥 {booking.guestCount} guests</span>
          </div>

          {/* Price & Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #f0f2ff, #a5b4fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {formatPrice(booking.totalPrice)}
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link
                href={`/venues/${booking.venueId}`}
                className="btn btn-ghost"
                style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
              >
                View Venue
              </Link>
              {booking.status === "confirmed" && (
                <button
                  className="btn btn-ghost"
                  onClick={handleCancel}
                  disabled={cancelling}
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.35rem 0.75rem",
                    color: "var(--error)",
                    opacity: cancelling ? 0.6 : 1,
                  }}
                >
                  {cancelling ? "Cancelling…" : "Cancel"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking ID footer */}
      <div
        style={{
          borderTop: "1px solid var(--border-card)",
          padding: "0.5rem 1.25rem",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          background: "var(--bg-elevated)",
        }}
      >
        Booking ID: {booking.id} · Booked on {new Date(booking.createdAt).toLocaleDateString("en-IN")}
      </div>
    </div>
  );
}

function MyBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(getMyBookings());
  }, []);

  function handleCancel(id: string) {
    setBookings(getMyBookings());
  }

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const past = bookings.filter((b) => b.status !== "confirmed");

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          My Bookings
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem" }}>
          Track and manage your venue reservations
        </p>
      </div>

      {bookings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 1.5rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📅</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            No bookings yet
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.75rem" }}>
            Discover and book amazing venues for your next event.
          </p>
          <Link href="/venues" className="btn btn-primary">
            Browse Venues →
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {confirmed.length > 0 && (
            <div style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="badge badge-success">✓ {confirmed.length}</span>
                Upcoming Bookings
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {confirmed.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                ))}
              </div>
            </div>
          )}

          {/* Past / Cancelled */}
          {past.length > 0 && (
            <div>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
                Past & Cancelled
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <AuthGuard>
      <MyBookingsContent />
    </AuthGuard>
  );
}
