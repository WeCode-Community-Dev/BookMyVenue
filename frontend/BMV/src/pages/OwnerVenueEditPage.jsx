import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ImageIcon, IndianRupee, Save } from "lucide-react";
import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import {
  fetchVenueByIdAsync,
  fetchVenueTypesAsync,
  fetchAmenitiesAsync,
  updateVenueAsync,
  linkVenueAmenityAsync,
  unlinkVenueAmenityAsync,
  clearActiveVenue,
  clearVenueOwnerError,
} from "../modules/venueOwner/venueOwnerSlice";

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
}

function Skeleton() {
  return (
    <OwnerLayout>
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-100 rounded-lg" />
        <div className="h-96 bg-gray-100 rounded-2xl" />
      </div>
    </OwnerLayout>
  );
}

function OwnerVenueEditPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    activeVenue: venue,
    venueTypes,
    amenities: allAmenities,
    loading,
    error,
  } = useSelector((s) => s.venueOwner);

  // fields === null means "not ready yet" — show skeleton.
  // This is the single source of truth for readiness, independent of
  // loading.activeVenue which starts false and can't guard the first render.
  const [fields, setFields] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Clear immediately so stale data from a previous venue never flashes.
    setFields(null);
    dispatch(clearActiveVenue());
    dispatch(clearVenueOwnerError());
    dispatch(fetchVenueByIdAsync(id));
    dispatch(fetchVenueTypesAsync());
    dispatch(fetchAmenitiesAsync());

    return () => {
      dispatch(clearActiveVenue());
      dispatch(clearVenueOwnerError());
    };
  }, [dispatch, id]);

  // Pre-fill once venue arrives. Guard: venue must be a non-null object
  // with a real id — rules out the cleared null and any partial state.
  useEffect(() => {
    if (venue && venue.id) {
      setFields({
        name:        venue.name ?? "",
        location:    venue.location ?? "",
        venueTypeId: venue.venue_type?.id ?? "",
        capacity:    venue.capacity ?? "",
        dailyRate:   venue.price_per_day ?? "",
        description: venue.description ?? "",
        imageUrl:    venue.image_url ?? "",
      });
    }
  }, [venue]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const validate = () => {
    if (!fields) return false;
    const next = {};
    if (!fields.name.trim())     next.name        = "Venue name is required";
    if (!fields.location.trim()) next.location     = "Location is required";
    if (!fields.venueTypeId)     next.venueTypeId  = "Select a venue type";
    if (!fields.dailyRate || Number(fields.dailyRate) <= 0)
      next.dailyRate = "Enter a valid daily rate";
    if (fields.capacity && Number(fields.capacity) <= 0)
      next.capacity = "Capacity must be a positive number";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      updateVenueAsync({
        id: venue.id,
        payload: {
          name:          fields.name.trim(),
          location:      fields.location.trim(),
          venue_type_id: Number(fields.venueTypeId),
          price_per_day: Number(fields.dailyRate),
          capacity:      fields.capacity ? Number(fields.capacity) : null,
          description:   fields.description.trim() || null,
          image_url:     fields.imageUrl.trim() || null,
        },
      }),
    );

    if (updateVenueAsync.fulfilled.match(result)) {
      setSaveSuccess(true);
    }
  };

  const handleToggleAmenity = (amenityId) => {
    if (!venue) return;
    const isLinked = venue.amenities?.some((a) => a.id === amenityId);
    if (isLinked) {
      dispatch(unlinkVenueAmenityAsync({ venueId: venue.id, amenityId }));
    } else {
      dispatch(linkVenueAmenityAsync({ venueId: venue.id, amenityId }));
    }
  };

  // ── Guard: show skeleton until fields are ready ───────────────────────────
  // Do NOT gate on loading.activeVenue — it starts false so it can't protect
  // the first render. Gate on fields instead: null = not ready, object = ready.
  if (!fields) return <Skeleton />;

  const inputBase   = "w-full rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none border transition";
  const inputNormal = "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-300 focus:border-transparent";
  const inputError  = "border-red-400 bg-red-50";

  return (
    <OwnerLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">
            Edit — {venue?.name}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Changes are saved to the venue on submit.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        {saveSuccess && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            ✓ Venue details saved successfully.
          </p>
        )}

        {/* Core fields */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-5">
          <h3 className="text-sm font-semibold text-rose-900">Venue Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Venue Name" error={fieldErrors.name}>
              <input
                name="name"
                type="text"
                placeholder="e.g. Grand Ballroom"
                value={fields.name}
                onChange={handleChange}
                className={`${inputBase} ${fieldErrors.name ? inputError : inputNormal}`}
              />
            </Field>

            <Field label="Venue Type" error={fieldErrors.venueTypeId}>
              <select
                name="venueTypeId"
                value={fields.venueTypeId}
                onChange={handleChange}
                className={`${inputBase} ${fieldErrors.venueTypeId ? inputError : inputNormal}`}
              >
                <option value="" disabled>Select a type</option>
                {venueTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Location" error={fieldErrors.location}>
              <input
                name="location"
                type="text"
                placeholder="City, Kerala"
                value={fields.location}
                onChange={handleChange}
                className={`${inputBase} ${fieldErrors.location ? inputError : inputNormal}`}
              />
            </Field>

            <Field label="Capacity (Guests)" error={fieldErrors.capacity}>
              <input
                name="capacity"
                type="number"
                min="1"
                placeholder="500"
                value={fields.capacity}
                onChange={handleChange}
                className={`${inputBase} ${fieldErrors.capacity ? inputError : inputNormal}`}
              />
            </Field>

            <Field label="Daily Rate (₹)" error={fieldErrors.dailyRate}>
              <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 border transition ${fieldErrors.dailyRate ? inputError : "border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-transparent"}`}>
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
            </Field>

            <Field label="Image URL">
              <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-transparent">
                <ImageIcon size={14} className="text-gray-400 shrink-0" />
                <input
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={fields.imageUrl}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              name="description"
              rows={3}
              placeholder="Describe your venue's unique features..."
              value={fields.description}
              onChange={handleChange}
              className={`${inputBase} ${inputNormal} resize-none`}
            />
          </Field>
        </div>

        {/* Amenities — live toggle */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-rose-900 mb-1">Amenities</h3>
          <p className="text-xs text-gray-400 mb-3">
            Tap to add or remove — changes apply instantly.
          </p>
          {allAmenities.length === 0 ? (
            <p className="text-xs text-gray-400">Loading amenities...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allAmenities.map((amenity) => {
                const isLinked = venue?.amenities?.some((a) => a.id === amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isLinked
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading.updatingVenue}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-900 hover:bg-rose-950 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {loading.updatingVenue ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </OwnerLayout>
  );
}

export default OwnerVenueEditPage;