// src/app/features/owner/components/VenueCard.tsx

"use client";

import { useState } from "react";
import { Venue } from "../type";

interface Props {
  venue: Venue;
  onToggleStatus: (id: string, current: "active" | "inactive") => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const STATUS_CONFIG = {
  active: { label: "Active", className: "status-active" },
  inactive: { label: "Inactive", className: "status-inactive" },
  pending: { label: "Pending", className: "status-pending" },
};

const CATEGORY_ICONS: Record<string, string> = {
  wedding: "💍",
  conference: "🎙️",
  concert: "🎵",
  sports: "⚽",
  party: "🎉",
  corporate: "🏢",
  outdoor: "🌿",
  default: "🏛️",
};

export default function VenueCard({ venue, onToggleStatus, onDelete }: Props) {
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const status = STATUS_CONFIG[venue.status] ?? STATUS_CONFIG.inactive;
  const icon = CATEGORY_ICONS[venue.category?.toLowerCase()] ?? CATEGORY_ICONS.default;

  async function handleToggle() {
    if (venue.status === "pending") return;
    setBusy(true);
    await onToggleStatus(venue.id, venue.status as "active" | "inactive");
    setBusy(false);
  }

  async function handleDelete() {
    setBusy(true);
    await onDelete(venue.id);
    setBusy(false);
    setConfirmDelete(false);
  }

  return (
    <div className={`owner-venue-card ${venue.status}`}>
      {/* Status stripe */}
      <div className="venue-card-stripe" />

      <div className="venue-card-header">
        <div className="venue-card-icon-wrap">
          <span className="venue-category-icon">{icon}</span>
        </div>
        <span className={`venue-status-pill ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="venue-card-body">
        <h3 className="venue-card-name">{venue.name}</h3>
        <p className="venue-card-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {venue.city}{venue.location ? `, ${venue.location}` : ""}
        </p>
        <p className="venue-card-desc">{venue.description}</p>
      </div>

      <div className="venue-card-meta">
        <div className="venue-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          <span>{venue.capacity.toLocaleString()} guests</span>
        </div>
        <div className="venue-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
          <span>₹{venue.price_per_hour.toLocaleString()}/hr</span>
        </div>
        {venue.total_bookings !== undefined && (
          <div className="venue-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{venue.total_bookings} bookings</span>
          </div>
        )}
      </div>

      {venue.amenities?.length > 0 && (
        <div className="venue-card-amenities">
          {venue.amenities.slice(0, 4).map((a) => (
            <span key={a} className="amenity-tag">{a}</span>
          ))}
          {venue.amenities.length > 4 && (
            <span className="amenity-tag amenity-more">+{venue.amenities.length - 4}</span>
          )}
        </div>
      )}

      <div className="venue-card-actions">
        {!confirmDelete ? (
          <>
            <button
              className="venue-action-btn toggle-btn"
              onClick={handleToggle}
              disabled={busy || venue.status === "pending"}
              title={venue.status === "pending" ? "Awaiting review" : `Mark as ${venue.status === "active" ? "inactive" : "active"}`}
            >
              {venue.status === "active" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Deactivate
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Activate
                </>
              )}
            </button>
            <button
              className="venue-action-btn delete-btn"
              onClick={() => setConfirmDelete(true)}
              disabled={busy}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Delete
            </button>
          </>
        ) : (
          <div className="venue-confirm-delete">
            <span>Are you sure?</span>
            <button className="venue-action-btn confirm-btn" onClick={handleDelete} disabled={busy}>
              {busy ? "Deleting…" : "Yes, delete"}
            </button>
            <button className="venue-action-btn cancel-btn" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}