import { useEffect, useState, useRef } from "react";
import { X, ImageIcon, IndianRupee, UploadCloud } from "lucide-react";
import {
  parsePolicyDays,
  validateCancellationPolicyFields,
  policyPayloadFromFields,
} from "../../utils/cancellationPolicy";



const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


const initialFormState = {
  name: "",
  location: "",
  googleMapsUrl: "",
  venueTypeId: "",
  capacity: "",
  dailyRate: "",
  description: "",
  imageUrl: "",
  refund50Days: "",
  refund25Days: "",
  cancelCutoffDays: "",
  advancePercent: "30",
  allowPayAtVenue: true,
};

function AddVenueModal({
  isOpen,
  onClose,
  onSubmit,
  venueTypes = [],
  amenities = [],
  submitting = false,
  error = null,
}) {
  const [fields, setFields] = useState(initialFormState);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);
  const [errors, setErrors] = useState({});


  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFields({
        ...initialFormState,
        venueTypeId: venueTypes[0]?.id ?? "",
      });
      setSelectedAmenityIds([]);
      setErrors({});
      setImageFile(null);
      setImagePreview(null);
      setUploadError(null);
      setUploadProgress(0);
      setIsDragging(false);
    }
  }, [isOpen, venueTypes]);

  
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (id) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const applyImageFile = (file) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setUploadError("Only JPG, PNG, WEBP, or GIF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }

    setUploadError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFields((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleFileInputChange = (e) => {
    applyImageFile(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    applyImageFile(e.dataTransfer.files?.[0] ?? null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadError(null);
    setUploadProgress(0);
    setFields((prev) => ({ ...prev, imageUrl: "" }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } else {
          reject(new Error("Cloudinary upload failed."));
        }
      });

      xhr.addEventListener("error", () =>
        reject(new Error("Network error during upload."))
      );

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
      );
      xhr.send(formData);
    });
  };

  const validate = () => {
    const next = {};
    if (!fields.name.trim()) next.name = "Venue name is required";
    if (!fields.location.trim()) next.location = "Location is required";
    if (!fields.venueTypeId) next.venueTypeId = "Select a venue type";
    if (!fields.dailyRate || Number(fields.dailyRate) <= 0)
      next.dailyRate = "Enter a valid daily rate";
    if (fields.capacity && Number(fields.capacity) <= 0)
      next.capacity = "Capacity must be a positive number";
    const pct = Number(fields.advancePercent);
    if (!pct || pct < 1 || pct > 100)
      next.advancePercent = "Advance must be between 1 and 100";
    const policyError = validateCancellationPolicyFields(
      parsePolicyDays(fields.refund50Days),
      parsePolicyDays(fields.refund25Days),
      parsePolicyDays(fields.cancelCutoffDays),
    );
    if (policyError) next.cancellationPolicy = policyError;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  let finalImageUrl = null;

  if (imageFile) {
    try {
      setUploading(true);
      setUploadProgress(0);
      finalImageUrl = await uploadToCloudinary(imageFile);
    } catch (err) {
      setUploadError(err.message || "Image upload failed. Please try again.");
      setUploading(false);
      return;
    } finally {
      setUploading(false);
    }
  }

  onSubmit({
    name: fields.name.trim(),
    location: fields.location.trim(),
    google_maps_url: fields.googleMapsUrl.trim() || null,
    price_per_day: Number(fields.dailyRate),
    venue_type_id: Number(fields.venueTypeId),
    capacity: fields.capacity ? Number(fields.capacity) : null,
    description: fields.description.trim() || null,
    image_url: finalImageUrl,
    amenityIds: selectedAmenityIds,
    advance_percent: Number(fields.advancePercent) || 30,
    allow_pay_at_venue: Boolean(fields.allowPayAtVenue),
    ...policyPayloadFromFields(
      fields.refund50Days,
      fields.refund25Days,
      fields.cancelCutoffDays,
    ),
  });
};

  const isSubmitDisabled = submitting || uploading;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 sm:p-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-rose-900">Add New Venue</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Venue Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Venue Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Grand Ballroom"
                  value={fields.name}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none border transition
                    ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-300 focus:border-transparent"}`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">⚠ {errors.name}</p>
                )}
              </div>

              {/* Venue Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Venue Type
                </label>
                <select
                  name="venueTypeId"
                  value={fields.venueTypeId}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none border transition
                    ${errors.venueTypeId ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-300 focus:border-transparent"}`}
                >
                  <option value="" disabled>
                    {venueTypes.length === 0 ? "Loading types..." : "Select a type"}
                  </option>
                  {venueTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.venueTypeId && (
                  <p className="mt-1 text-xs text-red-500">⚠ {errors.venueTypeId}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  type="text"
                  placeholder="City, Kerala"
                  value={fields.location}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none border transition
                    ${errors.location ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-300 focus:border-transparent"}`}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-500">⚠ {errors.location}</p>
                )}
              </div>

              {/* Google Maps link — optional, owner pastes share URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Google Maps link (optional)
                </label>
                <input
                  name="googleMapsUrl"
                  type="url"
                  placeholder="https://maps.app.goo.gl/..."
                  value={fields.googleMapsUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-300 focus:border-transparent transition"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Paste the share link from Google Maps so customers can open directions.
                </p>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Capacity (Guests)
                </label>
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="500"
                  value={fields.capacity}
                  onChange={handleChange}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none border transition
                    ${errors.capacity ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-300 focus:border-transparent"}`}
                />
                {errors.capacity && (
                  <p className="mt-1 text-xs text-red-500">⚠ {errors.capacity}</p>
                )}
              </div>

              {/* Daily Rate */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Daily Rate (₹)
                </label>
                <div
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 border transition
                    ${errors.dailyRate ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-transparent"}`}
                >
                  <IndianRupee size={14} className="text-gray-400 shrink-0" />
                  <input
                    name="dailyRate"
                    type="number"
                    min="0"
                    placeholder="25,000"
                    value={fields.dailyRate}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  />
                </div>
                {errors.dailyRate && (
                  <p className="mt-1 text-xs text-red-500">⚠ {errors.dailyRate}</p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Amenities
                {selectedAmenityIds.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-semibold">
                    {selectedAmenityIds.length} selected
                  </span>
                )}
              </label>
              {amenities.length === 0 ? (
                <p className="text-xs text-gray-400">Loading amenities...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => {
                    const isSelected = selectedAmenityIds.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          isSelected
                            ? "bg-rose-900 border-rose-900 text-white"
                            : "bg-white border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-800"
                        }`}
                      >
                        {amenity.name}
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                These will be linked to the venue right after it&apos;s created.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe your venue's unique features..."
                value={fields.description}
                onChange={handleChange}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none"
              />
            </div>

            {/* Cancellation policy */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cancellation policy (optional)
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Days before check-in. Leave all empty for no tiered policy.
              </p>
              {errors.cancellationPolicy && (
                <p className="mb-2 text-xs text-red-500">⚠ {errors.cancellationPolicy}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  name="refund50Days"
                  type="number"
                  min="1"
                  placeholder="Full refund days"
                  value={fields.refund50Days}
                  onChange={handleChange}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm border border-gray-200 bg-gray-50"
                />
                <input
                  name="refund25Days"
                  type="number"
                  min="1"
                  placeholder="50% refund days"
                  value={fields.refund25Days}
                  onChange={handleChange}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm border border-gray-200 bg-gray-50"
                />
                <input
                  name="cancelCutoffDays"
                  type="number"
                  min="1"
                  placeholder="Last cancel days"
                  value={fields.cancelCutoffDays}
                  onChange={handleChange}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm border border-gray-200 bg-gray-50"
                />
              </div>
            </div>

            {/* Payment options */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Payment options
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Advance %</label>
                  <input
                    name="advancePercent"
                    type="number"
                    min="1"
                    max="100"
                    value={fields.advancePercent}
                    onChange={handleChange}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm border ${
                      errors.advancePercent
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  {errors.advancePercent && (
                    <p className="mt-1 text-xs text-red-500">⚠ {errors.advancePercent}</p>
                  )}
                </div>
                <label className="flex items-center gap-2 mt-6 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="allowPayAtVenue"
                    checked={Boolean(fields.allowPayAtVenue)}
                    onChange={(e) =>
                      setFields((prev) => ({
                        ...prev,
                        allowPayAtVenue: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-rose-900 focus:ring-rose-300"
                  />
                  Allow pay at venue
                </label>
              </div>
            </div>

            {/* ── Venue Image ──────────────────────────────────────── */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Venue Image
              </label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {imagePreview ? (
                /* ── Preview card ── */
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Venue preview"
                    className="w-full h-48 object-cover"
                  />

                  {/* Progress bar while uploading */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                      <p className="text-white text-xs font-semibold">
                        Uploading… {uploadProgress}%
                      </p>
                      <div className="w-48 h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Remove button */}
                  {!uploading && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {/* Change button */}
                  {!uploading && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <ImageIcon size={12} />
                      Change
                    </button>
                  )}
                </div>
              ) : (
                /* ── Drop zone ── */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-2 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors
                    ${isDragging
                      ? "border-rose-400 bg-rose-50"
                      : "border-gray-200 bg-gray-50 hover:border-rose-300 hover:bg-rose-50/40"
                    }`}
                >
                  <UploadCloud
                    size={28}
                    className={isDragging ? "text-rose-500" : "text-gray-300"}
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-500">
                      Drag & drop or{" "}
                      <span className="text-rose-700 underline underline-offset-2">
                        browse
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      JPG, PNG, WEBP or GIF · max 5 MB
                    </p>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="mt-1.5 text-xs text-red-500">⚠ {uploadError}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-5 py-2.5 rounded-full bg-rose-900 hover:bg-rose-950 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading…" : submitting ? "Adding…" : "Add Venue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVenueModal;