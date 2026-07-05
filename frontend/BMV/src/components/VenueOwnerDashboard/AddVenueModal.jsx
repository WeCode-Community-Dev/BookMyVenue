import { useEffect, useState } from "react";
import { X, ImageIcon, IndianRupee } from "lucide-react";

const initialFormState = {
  name: "",
  location: "",
  venueTypeId: "",
  capacity: "",
  dailyRate: "",
  description: "",
  imageUrl: "",
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

  // Lock body scroll while the modal is open, restore on close/unmount
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Reset form each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setFields({
        ...initialFormState,
        venueTypeId: venueTypes[0]?.id ?? "",
      });
      setSelectedAmenityIds([]);
      setErrors({});
    }
  }, [isOpen, venueTypes]);

  // Close on Escape
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

  const validate = () => {
    const next = {};
    if (!fields.name.trim()) next.name = "Venue name is required";
    if (!fields.location.trim()) next.location = "Location is required";
    if (!fields.venueTypeId) next.venueTypeId = "Select a venue type";
    if (!fields.dailyRate || Number(fields.dailyRate) <= 0)
      next.dailyRate = "Enter a valid daily rate";
    if (fields.capacity && Number(fields.capacity) <= 0)
      next.capacity = "Capacity must be a positive number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // amenityIds is passed separately — OwnerVenuesPage links them after
    // the venue is created, since /venue-amenities/ needs a venue_id first.
    onSubmit({
      name: fields.name.trim(),
      location: fields.location.trim(),
      price_per_day: Number(fields.dailyRate),
      venue_type_id: Number(fields.venueTypeId),
      capacity: fields.capacity ? Number(fields.capacity) : null,
      description: fields.description.trim() || null,
      image_url: fields.imageUrl.trim() || null,
      amenityIds: selectedAmenityIds,
    });
  };

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

            {/* Image URL */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Image URL
              </label>
              <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-transparent">
                <ImageIcon size={14} className="text-gray-400 shrink-0" />
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/venue-photo.jpg"
                  value={fields.imageUrl}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Direct image upload isn&apos;t available yet — paste a hosted image link for now.
              </p>
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
              disabled={submitting}
              className="px-5 py-2.5 rounded-full bg-rose-900 hover:bg-rose-950 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Venue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVenueModal;