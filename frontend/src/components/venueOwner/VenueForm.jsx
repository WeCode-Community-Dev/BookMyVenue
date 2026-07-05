import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { getVenueCategories } from "../../services/venueCategory.service.js";
import { getAmenities } from "../../services/amenity.service.js";

const AUTOSAVE_DELAY_MS = 2000;

// Builds the API payload from raw RHF values. Autosave persists whatever the
// owner has typed — including blanks (so clearing a field is saved) and
// format-invalid values — since a draft may be incomplete. Number fields are
// enforced numeric at the input level, so they coerce cleanly here (empty → null
// to clear). Used by both autosave and the final submit.
function buildPayload(data) {
    const payload = {
        name:          (data.name ?? "").trim(),
        description:   (data.description ?? "").trim(),
        venueCategory: data.venueCategory || "",
        // RHF collects the checked amenity checkboxes into an array of _id
        // strings (or a bare string if the group renders a single box). Normalise
        // to an array and drop any falsy entries left by unchecked boxes.
        amenities: [data.amenities].flat().filter(Boolean),
        addressLine:   (data.addressLine ?? "").trim(),
        city:          (data.city ?? "").trim(),
        district:      data.district || "",
        state:         (data.state ?? "").trim(),
        pincode:       (data.pincode ?? "").trim(),
        // With valueAsNumber, an empty/invalid number input yields NaN — store
        // null in that case
        capacity:      Number.isFinite(data.capacity) ? data.capacity : null,
        basePrice:     Number.isFinite(data.basePrice) ? data.basePrice : null,
        location:
            data.latitude && data.longitude
                ? { type: "Point", coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)] }
                : null,
    };
    return payload;
}

const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
    "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
    "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod",
];

// --- Small helpers -----------------------------------------------------------

function FieldError({ error }) {
    if (!error) return null;
    return <p className="mt-1.5 text-sm text-red-600">{error.message}</p>;
}

// Blocks characters type="number" still permits (e, E, +, -) plus the decimal
// point for integer fields — so number inputs only ever hold digits.
function blockNonInteger(e) {
    if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
}

function inputCls(hasError) {
    return (
        "w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 " +
        "placeholder-gray-400 transition focus:outline-none focus:ring-2 " +
        (hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-300 focus:border-red-500 focus:ring-red-100")
    );
}

// ----------------------------------------------------------------------------

export default function VenueForm({ initialValues = {}, onAutosave, onSubmit, onContinueLater }) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [amenities, setAmenities] = useState([]);
    const [loadingAmenities, setLoadingAmenities] = useState(true);
    const [imageFiles, setImageFiles] = useState([]);   // new uploads
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    // "idle" | "saving" | "saved" — drives the subtle autosave indicator.
    const [saveStatus, setSaveStatus] = useState("idle");
    // True from the moment an edit arms the debounce timer until that autosave
    // settles — used to block "Continue Editing Later" so a pending save isn't
    // dropped by navigating away.
    const [pendingSave, setPendingSave] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        subscribe,
        setError,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name:        initialValues.name        || "",
            description: initialValues.description || "",
            venueCategory: initialValues.venueCategory?._id
                        || initialValues.venueCategory
                        || "",
            // Populated amenities arrive as {_id, identifier, name} objects (or
            // bare id strings on an unpopulated read); reduce to id strings so the
            // checkbox `value`s match and pre-check the venue's saved amenities.
            amenities: (initialValues.amenities || []).map((a) => a?._id || a),
            capacity:    initialValues.capacity    || "",
            basePrice:   initialValues.basePrice   || "",
            addressLine: initialValues.addressLine || "",
            city:        initialValues.city        || "",
            district:    initialValues.district    || "",
            state:       initialValues.state       || "",
            pincode:     initialValues.pincode     || "",
            latitude:    initialValues.location?.coordinates?.[1] || "",
            longitude:   initialValues.location?.coordinates?.[0] || "",
        },
    });

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getVenueCategories();
                setCategories(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingCategories(false);
            }
        }
        async function loadAmenities() {
            try {
                const data = await getAmenities();
                setAmenities(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingAmenities(false);
            }
        }
        loadCategories();
        loadAmenities();
    }, []);

    // ── Autosave ─────────────────────────────────────────────────────────────
    // Debounced ~2s after the user stops typing. The full payload is saved as-is
    // (including blank/invalid values — a draft may be incomplete; the submit
    // endpoint is the validation gate), skipping the API call when nothing changed
    // since the last save. The parent's onAutosave performs the PATCH; we only
    // drive the "saving"/"saved" indicator here.
    const lastSavedRef = useRef("");      // JSON snapshot of the last payload we sent
    const onAutosaveRef = useRef(onAutosave);
    onAutosaveRef.current = onAutosave;
    // Fields changed since the last autosave — each cycle validates only these
    // (see runAutosave). Because trigger() is additive, errors accumulate across
    // cycles, so every edited field stays flagged while untouched fields stay quiet.
    const dirtyFieldsRef = useRef(new Set());

    useEffect(() => {
        if (!onAutosave) return;
        const unsubscribe = subscribe({
            formState: { values: true },
            callback: ({ name }) => {
                if (name) dirtyFieldsRef.current.add(name);
                if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
                setPendingSave(true);
                autosaveTimer.current = setTimeout(runAutosave, AUTOSAVE_DELAY_MS);
            },
        });
        return () => {
            unsubscribe();
            if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
        };
        // runAutosave is intentionally omitted — including it would re-subscribe
        // the listener on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribe, onAutosave]);

    const autosaveTimer = useRef(null);

    async function runAutosave() {
        // Cleared once this run settles (any exit path) so "Continue Editing
        // Later" re-enables only after the pending save is resolved.
        try {
            const payload = buildPayload(getValues());

            // Validate only the fields changed this cycle. trigger() is additive
            // — it updates the errors for just these fields and leaves all other
            // entries in formState.errors untouched. So errors accumulate: every
            // field the user has edited since opening the form keeps showing its
            // error until that field is re-validated as valid, while fields never
            // touched stay quiet. We save regardless of validity (a draft may be
            // incomplete; the submit endpoint is the gate)
            const changedFields = [...dirtyFieldsRef.current];
            dirtyFieldsRef.current.clear();
            if (changedFields.length) trigger(changedFields);

            const snapshot = JSON.stringify(payload);
            if (snapshot === lastSavedRef.current) return;   // nothing changed

            setSaveStatus("saving");
            try {
                await onAutosaveRef.current(payload);
                lastSavedRef.current = snapshot;
                setSaveStatus("saved");
            } catch {
                // api client already toasts; reset the indicator so it isn't stuck on "saving".
                setSaveStatus("idle");
            }
        } finally {
            setPendingSave(false);
        }
    }

    // "Submit for Approval" — full validation gate, then hand the complete payload up.
    async function handleFormSubmit(data) {
        if (!onSubmit) return;

        setSubmitting(true);
        setSubmitError("");
        try {
            await onSubmit({ ...buildPayload(data), imageFiles });
        } catch (err) {
            // The submit endpoint returns { missingFields: [...] } when the draft
            // is incomplete. The field names match this form's register keys, so
            // flag each one inline; focus the first so the user lands on it.
            const missingFields = err.data?.missingFields;
            if (Array.isArray(missingFields) && missingFields.length) {
                missingFields.forEach((field, i) =>
                    setError(field, { type: "server", message: "This field is required." }, { shouldFocus: i === 0 })
                );
                setSubmitError("Please complete the highlighted fields before submitting.");
            } else {
                setSubmitError(err.message || "Something went wrong. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-8">
            {/* Header — title + autosave indicator on the left, actions top-right */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {initialValues.status === "DRAFT" ? "Add Venue" : "Edit Venue"}
                    </h1>
                    {/* Subtle autosave indicator, directly under the title */}
                    <p className="mt-1 h-5 text-sm">
                        {saveStatus === "saving" && (
                            <span className="text-gray-400">Saving…</span>
                        )}
                        {saveStatus === "saved" && (
                            <span className="text-green-600">Saved</span>
                        )}
                        {saveStatus === "idle" && (
                            <span className="text-gray-400">Changes save automatically.</span>
                        )}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <button
                        type="button"
                        disabled={submitting || pendingSave}
                        onClick={onContinueLater}
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700
                            transition hover:border-gray-400 hover:bg-gray-50
                            disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Continue Editing Later
                    </button>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={handleSubmit(handleFormSubmit)}
                        className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white
                            transition hover:bg-red-700
                            disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? "Submitting…" : "Submit for Approval"}
                    </button>
                </div>
            </div>

            {/* Global submit error */}
            {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            {/* ── Basic Information ─────────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Basic Information
                </h2>

                <div className="space-y-5">
                    {/* Venue Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Venue Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Royal Grand Hall"
                            className={inputCls(errors.name)}
                            {...register("name", {
                                required: "Venue name is required",
                                minLength: { value: 3, message: "Name must be at least 3 characters" },
                                maxLength: { value: 100, message: "Name must be under 100 characters" },
                            })}
                        />
                        <FieldError error={errors.name} />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe the venue — ambiance, highlights, what makes it special..."
                            className={inputCls(errors.description)}
                            {...register("description", {
                                required: "Description is required",
                                minLength: { value: 20, message: "Description must be at least 20 characters" },
                                maxLength: { value: 2000, message: "Description must be under 2000 characters" },
                            })}
                        />
                        <FieldError error={errors.description} />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Venue Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            disabled={loadingCategories}
                            className={inputCls(errors.venueCategory) + " cursor-pointer"}
                            {...register("venueCategory", {
                                required: "Please select a category",
                            })}
                        >
                            <option value="">
                                {loadingCategories ? "Loading categories…" : "Select a category"}
                            </option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <FieldError error={errors.venueCategory} />
                    </div>

                    {/* Amenities — multiselect checkbox grid */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Amenities <span className="text-red-500">*</span>
                        </label>
                        <p className="mb-2.5 text-sm text-gray-500">
                            Select all amenities available at this venue.
                        </p>
                        {loadingAmenities ? (
                            <p className="text-sm text-gray-400">Loading amenities…</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
                                {amenities.map((amenity) => (
                                    <label
                                        key={amenity._id}
                                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                                    >
                                        <input
                                            type="checkbox"
                                            value={amenity._id}
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                            {...register("amenities", {
                                                required: "Select at least one amenity",
                                            })}
                                        />
                                        <span>{amenity.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        <FieldError error={errors.amenities} />
                    </div>
                </div>
            </section>

            {/* ── Venue Details ─────────────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Venue Details
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Capacity (guests) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            placeholder="e.g. 500"
                            onKeyDown={blockNonInteger}
                            className={inputCls(errors.capacity)}
                            {...register("capacity", {
                                required: "Capacity is required",
                                min: { value: 1, message: "Capacity must be at least 1" },
                                max: { value: 100000, message: "Capacity seems too large" },
                                valueAsNumber: true,
                            })}
                        />
                        <FieldError error={errors.capacity} />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Base Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 50000"
                            onKeyDown={blockNonInteger}
                            className={inputCls(errors.basePrice)}
                            {...register("basePrice", {
                                required: "Base price is required",
                                min: { value: 0, message: "Price cannot be negative" },
                                valueAsNumber: true,
                            })}
                        />
                        <FieldError error={errors.basePrice} />
                    </div>
                </div>
            </section>

            {/* ── Location ──────────────────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Location
                </h2>

                <div className="space-y-4">
                    {/* Address Line */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Address Line <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 42 MG Road, Near City Mall"
                            className={inputCls(errors.addressLine)}
                            {...register("addressLine", {
                                required: "Address is required",
                                minLength: { value: 5, message: "Enter a full address" },
                            })}
                        />
                        <FieldError error={errors.addressLine} />
                    </div>

                    {/* City + District */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Kochi"
                                className={inputCls(errors.city)}
                                {...register("city", {
                                    required: "City is required",
                                })}
                            />
                            <FieldError error={errors.city} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                District <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={inputCls(errors.district) + " cursor-pointer"}
                                {...register("district", {
                                    required: "Please select a district",
                                })}
                            >
                                <option value="">Select district</option>
                                {KERALA_DISTRICTS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <FieldError error={errors.district} />
                        </div>
                    </div>

                    {/* State + Pincode */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                State <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Kerala"
                                className={inputCls(errors.state)}
                                {...register("state", {
                                    required: "State is required",
                                })}
                            />
                            <FieldError error={errors.state} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 682001"
                                maxLength={6}
                                className={inputCls(errors.pincode)}
                                {...register("pincode", {
                                    required: "Pincode is required",
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: "Enter a valid 6-digit pincode",
                                    },
                                })}
                            />
                            <FieldError error={errors.pincode} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Coordinates
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Latitude
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 9.9312"
                            className={inputCls(errors.latitude)}
                            {...register("latitude", {
                                pattern: {
                                    value: /^-?\d{1,2}(\.\d+)?$/,
                                    message: "Enter a valid latitude",
                                },
                            })}
                        />
                        <FieldError error={errors.latitude} />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Longitude
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 76.2673"
                            className={inputCls(errors.longitude)}
                            {...register("longitude", {
                                pattern: {
                                    value: /^-?\d{1,3}(\.\d+)?$/,
                                    message: "Enter a valid longitude",
                                },
                            })}
                        />
                        <FieldError error={errors.longitude} />
                    </div>
                </div>
            </section>

            {/* ── Images ────────────────────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                    Images
                </h2>
                <p className="mb-4 text-sm text-gray-500">
                    Upload photos of the venue. JPG or PNG, up to 5 MB each.
                </p>

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:rounded-lg file:border-0
                        file:bg-red-50 file:px-4 file:py-2
                        file:text-sm file:font-medium file:text-red-600
                        hover:file:bg-red-100"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                />

                {/* Existing images */}
                {initialValues.images?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        {initialValues.images.map((img, i) => (
                            <img
                                key={i}
                                src={img.url}
                                alt={`venue-${i}`}
                                className="h-20 w-28 rounded-lg object-cover border border-gray-200"
                            />
                        ))}
                        <p className="w-full text-xs text-gray-400 mt-1">
                            Uploading new files will replace the existing images.
                        </p>
                    </div>
                )}

                {/* Preview newly selected files */}
                {imageFiles.length > 0 && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-gray-600">
                            Selected ({imageFiles.length}):
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {imageFiles.map((file, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-20 w-28 rounded-lg object-cover border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageFiles((prev) =>
                                                prev.filter((_, idx) => idx !== i)
                                            )
                                        }
                                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs leading-none hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <div className="pb-8" />
        </div>
    );
}