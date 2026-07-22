"use client";

import { useState } from "react";
import { Venue } from "@/lib/venues";
import { createBooking, formatPrice } from "@/lib/bookings";

interface BookingModalProps {
  venue: Venue;
  onClose: () => void;
  onSuccess: () => void;
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
];

function calcHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = (eh * 60 + em - (sh * 60 + sm)) / 60;
  return Math.max(diff, 0);
}

export default function BookingModal({ venue, onClose, onSuccess }: BookingModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [guestCount, setGuestCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hours = calcHours(startTime, endTime);
  const totalPrice = Math.round(hours * venue.price_per_hour);
  const isValid = hours > 0 && guestCount > 0 && guestCount <= venue.capacity;

  async function handleBook() {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 800)); // Simulate API delay
      createBooking({
        venueId: venue.id,
        venueName: venue.name,
        venueLocation: venue.location,
        venueImage: venue.images?.[0] ?? "",
        date,
        startTime,
        endTime,
        guestCount,
        pricePerHour: venue.price_per_hour,
      });
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          borderRadius: "var(--radius-xl)",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "var(--shadow-card), var(--shadow-glow)",
          animation: "fadeInUp 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 1.5rem 1rem",
            borderBottom: "1px solid var(--border-card)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Book Venue
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              {venue.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-card)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.125rem" }}>
          {/* Date */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Date
            </label>
            <input
              id="booking-date"
              type="date"
              className="input"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              style={{ colorScheme: "dark" }}
            />
          </div>

          {/* Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Start Time
              </label>
              <select
                id="booking-start-time"
                className="input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ appearance: "none", cursor: "pointer" }}
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                End Time
              </label>
              <select
                id="booking-end-time"
                className="input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ appearance: "none", cursor: "pointer" }}
              >
                {TIME_SLOTS.filter((t) => t > startTime).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Guests ({venue.capacity} max)
            </label>
            <input
              id="booking-guests"
              type="number"
              className="input"
              value={guestCount}
              min={1}
              max={venue.capacity}
              onChange={(e) => setGuestCount(Number(e.target.value))}
            />
          </div>

          {/* Price summary */}
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              <span>{formatPrice(venue.price_per_hour)} × {hours > 0 ? `${hours}h` : "—"}</span>
              <span>{hours > 0 ? formatPrice(totalPrice) : "—"}</span>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--border-card)",
                paddingTop: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
              }}
            >
              <span>Total</span>
              <span style={{ color: "var(--accent-300)" }}>
                {hours > 0 ? formatPrice(totalPrice) : "—"}
              </span>
            </div>
          </div>

          {error && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--error)",
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: "var(--radius-sm)",
                padding: "0.625rem 0.875rem",
              }}
            >
              {error}
            </p>
          )}

          {!isValid && hours <= 0 && (
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              ⚠️ End time must be after start time.
            </p>
          )}

          <button
            id="confirm-booking-btn"
            className="btn btn-primary"
            onClick={handleBook}
            disabled={!isValid || loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              opacity: !isValid || loading ? 0.6 : 1,
              cursor: !isValid || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Confirming…" : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
