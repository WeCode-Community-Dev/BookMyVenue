import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import ChipInput from "./ChipInput";
import VenueFormImagePreview, {
  VenueFormImageUpload,
} from "./VenueFormImagePreview";
import {
  geocodeVenueAddress,
  GeocodeError,
  GEOCODE_ERROR,
  getGeocodeUserMessage,
  hasRequiredGeocodeFields,
} from "../../../utils/geocode";
import {
  MAX_VENUE_IMAGES,
  scrollToFirstFormError,
  stringifyListField,
  validateImageSelection,
  validateVenueCoreFields,
} from "../../../utils/venueForm";

const LOCATION_FIELDS = new Set(["address", "city", "state", "pincode"]);
const LOCATION_VERIFIED_MESSAGE = "Location verified successfully";

const inputClass = (hasError) =>
  [
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-gray-200 focus:border-red-500 focus:ring-red-100",
  ].join(" ");

const sectionClass =
  "rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6";

const FormField = ({
  fieldKey,
  label,
  required = false,
  hint,
  error,
  children,
}) => {
  const hintId = hint ? `venue-${fieldKey}-hint` : undefined;
  const errorId = error ? `venue-${fieldKey}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div id={`venue-field-${fieldKey}`}>
      {label && (
        <label
          htmlFor={`venue-input-${fieldKey}`}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-600" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
      )}

      {hint && (
        <p id={hintId} className="mb-2 text-xs text-gray-500">
          {hint}
        </p>
      )}

      {typeof children === "function"
        ? children({
            id: `venue-input-${fieldKey}`,
            errorId,
            describedBy,
            hasError: Boolean(error),
          })
        : children}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

const VenueForm = ({
  mode = "create",
  initialValues,
  existingImages = [],
  submitError = "",
  submitting = false,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
}) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(initialValues);
  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [imageInputError, setImageInputError] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationDetectFeedback, setLocationDetectFeedback] = useState(null);
  const detectRequestIdRef = useRef(0);

  useEffect(() => {
    setForm(initialValues);
    setLocationDetectFeedback(null);
  }, [initialValues]);

  const displayImageCount = isEdit
    ? newImages.length > 0
      ? newImages.length
      : existingImages.length
    : newImages.length;

  const canAddMoreImages = newImages.length < MAX_VENUE_IMAGES;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (LOCATION_FIELDS.has(name)) {
        return {
          ...next,
          latitude: "",
          longitude: "",
        };
      }

      return next;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (LOCATION_FIELDS.has(name)) {
      setLocationDetectFeedback(null);
    }
  };

  const handleDetectLocation = async () => {
    if (isDetectingLocation || submitting) return;

    if (!hasRequiredGeocodeFields(form)) {
      setLocationDetectFeedback({
        type: "error",
        message: getGeocodeUserMessage(GEOCODE_ERROR.MISSING_REQUIRED),
      });
      return;
    }

    const requestId = detectRequestIdRef.current + 1;
    detectRequestIdRef.current = requestId;

    setIsDetectingLocation(true);
    setLocationDetectFeedback(null);

    try {
      const result = await geocodeVenueAddress(form);

      if (detectRequestIdRef.current !== requestId) return;

      if (!result) {
        setLocationDetectFeedback({
          type: "error",
          message: getGeocodeUserMessage(GEOCODE_ERROR.NOT_FOUND),
        });
        return;
      }

      setForm((prev) => ({
        ...prev,
        latitude: String(result.latitude),
        longitude: String(result.longitude),
      }));
      setLocationDetectFeedback({
        type: "success",
        message: LOCATION_VERIFIED_MESSAGE,
      });
    } catch (error) {
      if (detectRequestIdRef.current !== requestId) return;

      const code = error instanceof GeocodeError ? error.code : "NOT_FOUND";
      setLocationDetectFeedback({
        type: "error",
        message: getGeocodeUserMessage(code),
      });
    } finally {
      if (detectRequestIdRef.current === requestId) {
        setIsDetectingLocation(false);
      }
    }
  };

  const hasDetectedCoordinates =
    form.latitude !== "" &&
    form.longitude !== "" &&
    Number.isFinite(Number(form.latitude)) &&
    Number.isFinite(Number(form.longitude));

  const canDetectLocation = hasRequiredGeocodeFields(form);
  const showLocationVerified =
    hasDetectedCoordinates && locationDetectFeedback?.type !== "error";

  const handleListChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (event) => {
    const currentCount = isEdit ? newImages.length : newImages.length;

    const { valid, files, message } = validateImageSelection(event.target.files, {
      currentCount: isEdit ? currentCount : currentCount,
      maxCount: MAX_VENUE_IMAGES,
    });

    event.target.value = "";

    if (!valid) {
      setImageInputError(message);
      setErrors((prev) => ({ ...prev, images: message }));
      return;
    }

    setImageInputError("");
    setErrors((prev) => ({ ...prev, images: "" }));

    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    if (isEdit) {
      setNewImages((prev) => {
        const combined = [...prev, ...mapped];
        if (combined.length > MAX_VENUE_IMAGES) {
          const message = `You can upload a maximum of ${MAX_VENUE_IMAGES} images.`;
          setImageInputError(message);
          setErrors((prevErrors) => ({ ...prevErrors, images: message }));
          mapped.forEach((img) => URL.revokeObjectURL(img.preview));
          return prev;
        }

        return combined;
      });
      return;
    }

    setNewImages((prev) => [...prev, ...mapped]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
    setImageInputError("");
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const validate = () => {
    const nextErrors = validateVenueCoreFields(form);

    if (isEdit) {
      const willHaveImages = newImages.length > 0 || existingImages.length > 0;
      if (!willHaveImages) {
        nextErrors.images = "At least one image is required";
      }
    } else if (newImages.length === 0) {
      nextErrors.images = "At least one image is required";
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const errorSummary = useMemo(
    () => Object.entries(errors).map(([key, message]) => ({ key, message })),
    [errors]
  );

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim());
    formData.append("category", form.category.trim());
    formData.append("capacity", String(Number(form.capacity)));
    formData.append("price", String(Number(form.price)));
    formData.append("pricingUnit", form.pricingUnit);
    formData.append("address", form.address.trim());

    if (form.city.trim()) formData.append("city", form.city.trim());
    if (form.state.trim()) formData.append("state", form.state.trim());
    if (form.pincode.trim()) formData.append("pincode", form.pincode.trim());

    if (hasDetectedCoordinates) {
      formData.append("latitude", String(form.latitude));
      formData.append("longitude", String(form.longitude));
    }

    formData.append("amenities", stringifyListField(form.amenities));
    formData.append("rules", stringifyListField(form.rules));

    if (newImages.length > 0) {
      newImages.forEach(({ file }) => {
        formData.append("images", file);
      });
    }

    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstFormError(nextErrors);
      return;
    }

    await onSubmit(buildFormData());
  };

  const previewImages = isEdit && newImages.length === 0 ? existingImages : newImages;
  const previewIsRemote = isEdit && newImages.length === 0 && existingImages.length > 0;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-8">
      {errorSummary.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorSummary.map(({ key, message }) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {submitError}
        </div>
      )}

      {/* 1. Basic Information */}
      <section className={sectionClass} aria-labelledby="venue-section-basic">
        <h2 id="venue-section-basic" className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell guests what your venue offers.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField fieldKey="title" label="Title" required error={errors.title}>
              {({ id, describedBy, hasError }) => (
                <input
                  id={id}
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                  aria-invalid={hasError}
                  aria-describedby={describedBy}
                  className={inputClass(hasError)}
                />
              )}
            </FormField>
          </div>

          <div className="sm:col-span-2">
            <FormField
              fieldKey="description"
              label="Description"
              required
              error={errors.description}
            >
              {({ id, describedBy, hasError }) => (
                <textarea
                  id={id}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  disabled={submitting}
                  rows={4}
                  required
                  aria-invalid={hasError}
                  aria-describedby={describedBy}
                  className={inputClass(hasError)}
                />
              )}
            </FormField>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <FormField
              fieldKey="category"
              label="Category"
              required
              hint="e.g. Wedding Hall, Conference Room"
              error={errors.category}
            >
              {({ id, describedBy, hasError }) => (
                <input
                  id={id}
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="Wedding Hall"
                  required
                  aria-invalid={hasError}
                  aria-describedby={describedBy}
                  className={inputClass(hasError)}
                />
              )}
            </FormField>
          </div>
        </div>
      </section>

      {/* 2. Images */}
      <section className={sectionClass} aria-labelledby="venue-section-images">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="venue-section-images" className="text-lg font-semibold text-gray-900">
              Photos
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Showcase your venue with up to {MAX_VENUE_IMAGES} high-quality images.
            </p>
          </div>
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {displayImageCount} / {MAX_VENUE_IMAGES}
          </span>
        </div>

        {isEdit && existingImages.length > 0 && (
          <div
            role="alert"
            className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold">Uploading new photos replaces your entire gallery</p>
              <p className="mt-1 text-amber-900/90">
                New uploads replace all current photos when you save. Leave this empty to
                keep your existing gallery.
              </p>
            </div>
          </div>
        )}

        <div id="venue-field-images" className="mt-5">
          <VenueFormImageUpload
            inputId="venue-input-images"
            label={isEdit ? "Upload replacement photos" : "Upload photos"}
            required={!isEdit}
            disabled={submitting || !canAddMoreImages}
            canAddMore={canAddMoreImages}
            maxImages={MAX_VENUE_IMAGES}
            displayCount={displayImageCount}
            error={errors.images || imageInputError}
            maxHintId="venue-images-max-hint"
            errorId="venue-images-error"
            describedBy={
              [
                errors.images || imageInputError ? "venue-images-error" : "",
                !canAddMoreImages ? "venue-images-max-hint" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            onImageChange={handleImageChange}
          />
        </div>

        {previewImages.length > 0 && (
          <VenueFormImagePreview
            images={previewImages}
            isRemoteGallery={previewIsRemote}
            onRemove={removeNewImage}
            submitting={submitting}
          />
        )}
      </section>

      {/* 3. Pricing & Capacity */}
      <section className={sectionClass} aria-labelledby="venue-section-pricing">
        <h2 id="venue-section-pricing" className="text-lg font-semibold text-gray-900">
          Pricing &amp; Capacity
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          This is the amount charged for a booking slot.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField fieldKey="price" label="Price (₹)" required error={errors.price}>
            {({ id, describedBy, hasError }) => (
              <input
                id={id}
                type="number"
                name="price"
                min="0"
                value={form.price}
                onChange={handleChange}
                disabled={submitting}
                required
                aria-invalid={hasError}
                aria-describedby={describedBy}
                className={inputClass(hasError)}
              />
            )}
          </FormField>

          <FormField
            fieldKey="pricingUnit"
            label="Pricing unit"
            required
            error={errors.pricingUnit}
          >
            {({ id, describedBy, hasError }) => (
              <select
                id={id}
                name="pricingUnit"
                value={form.pricingUnit}
                onChange={handleChange}
                disabled={submitting}
                required
                aria-invalid={hasError}
                aria-describedby={describedBy}
                className={inputClass(hasError)}
              >
                <option value="perhour">Per hour</option>
                <option value="perday">Per day</option>
              </select>
            )}
          </FormField>

          <FormField
            fieldKey="capacity"
            label="Max guests"
            required
            error={errors.capacity}
          >
            {({ id, describedBy, hasError }) => (
              <input
                id={id}
                type="number"
                name="capacity"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                disabled={submitting}
                required
                aria-invalid={hasError}
                aria-describedby={describedBy}
                className={inputClass(hasError)}
              />
            )}
          </FormField>
        </div>
      </section>

      {/* 4. Location */}
      <section className={sectionClass} aria-labelledby="venue-section-location">
        <h2 id="venue-section-location" className="text-lg font-semibold text-gray-900">
          Location
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter the venue address, then detect the map location before saving.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField fieldKey="address" label="Address" required error={errors.address}>
              {({ id, describedBy, hasError }) => (
                <textarea
                  id={id}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={submitting}
                  rows={2}
                  required
                  aria-invalid={hasError}
                  aria-describedby={describedBy}
                  className={inputClass(hasError)}
                  placeholder="Street, building, landmark"
                />
              )}
            </FormField>
          </div>

          <FormField fieldKey="city" label="City" error={errors.city}>
            {({ id, describedBy, hasError }) => (
              <input
                id={id}
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={hasError}
                aria-describedby={describedBy}
                className={inputClass(hasError)}
              />
            )}
          </FormField>

          <FormField fieldKey="state" label="State" error={errors.state}>
            {({ id, describedBy, hasError }) => (
              <input
                id={id}
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={hasError}
                aria-describedby={describedBy}
                className={inputClass(hasError)}
              />
            )}
          </FormField>

          <FormField fieldKey="pincode" label="Pincode" error={errors.pincode}>
            {({ id, describedBy, hasError }) => (
              <input
                id={id}
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                disabled={submitting}
                inputMode="numeric"
                autoComplete="postal-code"
                aria-invalid={hasError}
                aria-describedby={describedBy}
                className={inputClass(hasError)}
                placeholder="e.g. 673016"
              />
            )}
          </FormField>

          <div className="flex flex-col justify-end sm:col-span-2">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={
                submitting || isDetectingLocation || !canDetectLocation
              }
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 transition-colors hover:border-red-200 hover:bg-red-50/40 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10 sm:w-auto"
            >
              {isDetectingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <MapPin className="h-4 w-4 text-red-600" aria-hidden="true" />
              )}
              {isDetectingLocation ? "Detecting location..." : "Detect Location"}
            </button>

            {!canDetectLocation && !isDetectingLocation && (
              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                Please enter Address, City, and State before detecting the
                location.
              </p>
            )}

            {locationDetectFeedback?.type === "error" && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {locationDetectFeedback.message}
              </p>
            )}

            {showLocationVerified && (
              <p
                role="status"
                className="mt-2 flex items-start gap-1.5 text-sm font-medium text-emerald-700"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {locationDetectFeedback?.type === "success"
                    ? locationDetectFeedback.message
                    : LOCATION_VERIFIED_MESSAGE}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Amenities */}
      <section className={sectionClass} aria-labelledby="venue-section-amenities">
        <h2 id="venue-section-amenities" className="text-lg font-semibold text-gray-900">
          Amenities
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Press Enter or comma to add each amenity.
        </p>

        <div className="mt-4" id="venue-field-amenities">
          <ChipInput
            id="venue-input-amenities"
            labelledBy="venue-section-amenities"
            hint="Examples: Parking, WiFi, Air Conditioning, Generator Backup, Dining Area"
            placeholder="Type an amenity and press Enter"
            value={form.amenities}
            onChange={(value) => handleListChange("amenities", value)}
            disabled={submitting}
            error={errors.amenities}
          />
        </div>
      </section>

      {/* 6. Rules */}
      <section className={sectionClass} aria-labelledby="venue-section-rules">
        <h2 id="venue-section-rules" className="text-lg font-semibold text-gray-900">
          Rules
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Press Enter or comma to add each rule.
        </p>

        <div className="mt-4" id="venue-field-rules">
          <ChipInput
            id="venue-input-rules"
            labelledBy="venue-section-rules"
            hint="Examples: No smoking, No outside food, Music off by 10 PM"
            placeholder="Type a rule and press Enter"
            value={form.rules}
            onChange={(value) => handleListChange("rules", value)}
            disabled={submitting}
            error={errors.rules}
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default VenueForm;
