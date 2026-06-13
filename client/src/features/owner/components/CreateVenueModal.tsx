// src/app/features/owner/components/CreateVenueModal.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { CreateVenuePayload } from "../type";

interface Props {
  open: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVenuePayload) => Promise<{ success: boolean; error?: string }>;
}

const CATEGORIES = [
  "Wedding", "Conference", "Concert", "Sports", "Party",
  "Corporate", "Outdoor", "Exhibition", "Workshop", "Other",
];

const AMENITY_SUGGESTIONS = [
  "Parking", "WiFi", "Air Conditioning", "Catering", "AV Equipment",
  "Stage", "Dressing Room", "Security", "Restrooms", "Generator Backup",
  "Projector", "Sound System", "Dance Floor", "Bar", "Kitchen",
];

const EMPTY_FORM: CreateVenuePayload = {
  name: "",
  description: "",
  location: "",
  city: "",
  capacity: 0,
  price_per_hour: 0,
  category: "",
  amenities: [],
};

export default function CreateVenueModal({ open, submitting, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateVenuePayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateVenuePayload, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [customAmenity, setCustomAmenity] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setErrors({});
      setApiError(null);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function set<K extends keyof CreateVenuePayload>(key: K, value: CreateVenuePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleAmenity(amenity: string) {
    const current = form.amenities;
    set("amenities", current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]);
  }

  function addCustomAmenity() {
    const trimmed = customAmenity.trim();
    if (trimmed && !form.amenities.includes(trimmed)) {
      set("amenities", [...form.amenities, trimmed]);
    }
    setCustomAmenity("");
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Venue name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.location.trim()) newErrors.location = "Location / address is required";
    if (!form.category) newErrors.category = "Select a category";
    if (!form.capacity || form.capacity < 1) newErrors.capacity = "Enter a valid capacity";
    if (!form.price_per_hour || form.price_per_hour < 1) newErrors.price_per_hour = "Enter a valid price";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    const result = await onSubmit(form);
    if (result.success) {
      onClose();
    } else {
      setApiError(result.error ?? "Something went wrong");
    }
  }

  if (!open) return null;

  return (
    <div className="owner-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="owner-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="owner-modal-header">
          <div>
            <h2 id="modal-title" className="owner-modal-title">List a New Venue</h2>
            <p className="owner-modal-subtitle">Fill in the details to publish your venue</p>
          </div>
          <button className="owner-modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="owner-modal-body">
          <form onSubmit={handleSubmit} noValidate>

            {/* Section: Basic Info */}
            <div className="owner-form-section">
              <h3 className="owner-form-section-title">
                <span className="section-number">1</span> Basic Information
              </h3>

              <div className="owner-field">
                <label className="owner-label" htmlFor="venue-name">Venue Name *</label>
                <input
                  ref={firstInputRef}
                  id="venue-name"
                  className={`owner-input ${errors.name ? "input-error" : ""}`}
                  type="text"
                  placeholder="e.g. The Grand Ballroom"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                {errors.name && <span className="owner-field-error">{errors.name}</span>}
              </div>

              <div className="owner-field">
                <label className="owner-label" htmlFor="venue-desc">Description *</label>
                <textarea
                  id="venue-desc"
                  className={`owner-textarea ${errors.description ? "input-error" : ""}`}
                  placeholder="Describe your venue — size, vibe, what makes it special…"
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                {errors.description && <span className="owner-field-error">{errors.description}</span>}
              </div>

              <div className="owner-field">
                <label className="owner-label" htmlFor="venue-category">Category *</label>
                <select
                  id="venue-category"
                  className={`owner-select ${errors.category ? "input-error" : ""}`}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c.toLowerCase()}>{c}</option>
                  ))}
                </select>
                {errors.category && <span className="owner-field-error">{errors.category}</span>}
              </div>
            </div>

            {/* Section: Location */}
            <div className="owner-form-section">
              <h3 className="owner-form-section-title">
                <span className="section-number">2</span> Location
              </h3>

              <div className="owner-field-row">
                <div className="owner-field">
                  <label className="owner-label" htmlFor="venue-city">City *</label>
                  <input
                    id="venue-city"
                    className={`owner-input ${errors.city ? "input-error" : ""}`}
                    type="text"
                    placeholder="e.g. Kochi"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                  {errors.city && <span className="owner-field-error">{errors.city}</span>}
                </div>
                <div className="owner-field">
                  <label className="owner-label" htmlFor="venue-location">Address / Area *</label>
                  <input
                    id="venue-location"
                    className={`owner-input ${errors.location ? "input-error" : ""}`}
                    type="text"
                    placeholder="e.g. MG Road, Ernakulam"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                  {errors.location && <span className="owner-field-error">{errors.location}</span>}
                </div>
              </div>
            </div>

            {/* Section: Capacity & Pricing */}
            <div className="owner-form-section">
              <h3 className="owner-form-section-title">
                <span className="section-number">3</span> Capacity & Pricing
              </h3>

              <div className="owner-field-row">
                <div className="owner-field">
                  <label className="owner-label" htmlFor="venue-capacity">Max Capacity *</label>
                  <div className="owner-input-prefix-wrap">
                    <span className="owner-input-prefix">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    </span>
                    <input
                      id="venue-capacity"
                      className={`owner-input with-prefix ${errors.capacity ? "input-error" : ""}`}
                      type="number"
                      min={1}
                      placeholder="200"
                      value={form.capacity || ""}
                      onChange={(e) => set("capacity", Number(e.target.value))}
                    />
                  </div>
                  {errors.capacity && <span className="owner-field-error">{errors.capacity}</span>}
                </div>

                <div className="owner-field">
                  <label className="owner-label" htmlFor="venue-price">Price per Hour (₹) *</label>
                  <div className="owner-input-prefix-wrap">
                    <span className="owner-input-prefix">₹</span>
                    <input
                      id="venue-price"
                      className={`owner-input with-prefix ${errors.price_per_hour ? "input-error" : ""}`}
                      type="number"
                      min={1}
                      placeholder="5000"
                      value={form.price_per_hour || ""}
                      onChange={(e) => set("price_per_hour", Number(e.target.value))}
                    />
                  </div>
                  {errors.price_per_hour && <span className="owner-field-error">{errors.price_per_hour}</span>}
                </div>
              </div>
            </div>

            {/* Section: Amenities */}
            <div className="owner-form-section">
              <h3 className="owner-form-section-title">
                <span className="section-number">4</span> Amenities
                <span className="section-optional">optional</span>
              </h3>

              <div className="amenity-grid">
                {AMENITY_SUGGESTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`amenity-chip ${form.amenities.includes(a) ? "amenity-chip-active" : ""}`}
                    onClick={() => toggleAmenity(a)}
                  >
                    {form.amenities.includes(a) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {a}
                  </button>
                ))}
              </div>

              <div className="custom-amenity-row">
                <input
                  className="owner-input"
                  type="text"
                  placeholder="Add custom amenity…"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomAmenity(); } }}
                />
                <button type="button" className="add-amenity-btn" onClick={addCustomAmenity}>
                  Add
                </button>
              </div>

              {form.amenities.length > 0 && (
                <div className="selected-amenities">
                  <span className="selected-label">Selected:</span>
                  {form.amenities.map((a) => (
                    <span key={a} className="amenity-tag">
                      {a}
                      <button
                        type="button"
                        className="amenity-remove"
                        onClick={() => set("amenities", form.amenities.filter((x) => x !== a))}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="owner-api-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {apiError}
              </div>
            )}

            {/* Footer */}
            <div className="owner-modal-footer">
              <button type="button" className="owner-btn-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="owner-btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    List Venue
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}