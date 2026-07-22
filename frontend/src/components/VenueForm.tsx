"use client";

import { useState } from "react";
import { VENUE_CATEGORIES, type CreateVenueInput } from "@/lib/venues";

interface VenueFormProps {
  initial?: CreateVenueInput;
  onSubmit: (data: CreateVenueInput) => Promise<void>;
  submitLabel: string;
}

export default function VenueForm({ initial, onSubmit, submitLabel }: VenueFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [capacity, setCapacity] = useState(initial?.capacity ?? 1);
  const [pricePerHour, setPricePerHour] = useState(initial?.price_per_hour ?? 0);
  const [images, setImages] = useState(initial?.images?.join("\n") ?? "");
  const [amenities, setAmenities] = useState(initial?.amenities?.join("\n") ?? "");
  const [highlights, setHighlights] = useState(initial?.highlights?.join("\n") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Name is required"); return; }
    if (!location.trim()) { setError("Location is required"); return; }
    if (capacity < 1) { setError("Capacity must be at least 1"); return; }
    if (pricePerHour < 0) { setError("Price must be 0 or greater"); return; }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        city: city.trim(),
        category,
        capacity,
        price_per_hour: pricePerHour,
        images: images.split("\n").map((s) => s.trim()).filter(Boolean),
        amenities: amenities.split("\n").map((s) => s.trim()).filter(Boolean),
        highlights: highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save venue");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-card)",
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: "0.375rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const fieldGroup: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {error && (
        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", color: "var(--error)", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={fieldGroup}>
          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="The Grand Hall" />
        </div>
        <div style={fieldGroup}>
          <label style={labelStyle}>Category</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {VENUE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your venue..."
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={fieldGroup}>
          <label style={labelStyle}>Location *</label>
          <input style={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Connaught Place, New Delhi" />
        </div>
        <div style={fieldGroup}>
          <label style={labelStyle}>City</label>
          <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} placeholder="New Delhi" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={fieldGroup}>
          <label style={labelStyle}>Capacity (guests) *</label>
          <input type="number" style={inputStyle} value={capacity} min={1} onChange={(e) => setCapacity(Number(e.target.value))} />
        </div>
        <div style={fieldGroup}>
          <label style={labelStyle}>Price per hour (₹) *</label>
          <input type="number" style={inputStyle} value={pricePerHour} min={0} step="0.01" onChange={(e) => setPricePerHour(Number(e.target.value))} />
        </div>
      </div>

      <div style={fieldGroup}>
        <label style={labelStyle}>Image URLs (one per line)</label>
        <textarea
          style={{ ...inputStyle, minHeight: "60px", resize: "vertical", fontFamily: "monospace", fontSize: "0.8rem" }}
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={fieldGroup}>
          <label style={labelStyle}>Amenities (one per line)</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical", fontFamily: "monospace", fontSize: "0.8rem" }}
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            placeholder="Wi-Fi&#10;Parking&#10;AV Equipment"
          />
        </div>
        <div style={fieldGroup}>
          <label style={labelStyle}>Highlights (one per line)</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical", fontFamily: "monospace", fontSize: "0.8rem" }}
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="Crystal chandeliers&#10;400 sq m dance floor"
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border-card)" }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ padding: "0.75rem 2rem", fontSize: "1rem", opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
