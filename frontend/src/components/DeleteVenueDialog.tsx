"use client";

interface DeleteVenueDialogProps {
  venueId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteVenueDialog({ onConfirm, onCancel }: DeleteVenueDialogProps) {
  return (
    <div
      onClick={onCancel}
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
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          borderRadius: "var(--radius-xl)",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "var(--shadow-card), var(--shadow-glow)",
          padding: "1.75rem",
          animation: "fadeInUp 0.3s ease",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🗑️</div>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Delete Venue
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          Are you sure you want to delete this venue? This action cannot be undone. All associated bookings will remain.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            style={{ padding: "0.625rem 1.25rem", fontSize: "0.9rem" }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            style={{
              padding: "0.625rem 1.25rem",
              fontSize: "0.9rem",
              background: "var(--error)",
              border: "none",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
