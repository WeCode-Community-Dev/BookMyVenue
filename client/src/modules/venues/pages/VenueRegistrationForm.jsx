import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { registerVenueSchema } from "./../../../../../server/src/modules/venues/venues.validation";
import { venueRegistrationApi } from "../api/venue.api";

const VENUE_TYPES = [
  { value: "AUDITORIUM", label: "Auditorium" },
  { value: "BANQUET_HALL", label: "Banquet Hall" },
  { value: "CAFE", label: "Café" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "CONFERENCE_ROOM", label: "Conference Room" },
  { value: "STUDIO", label: "Studio" },
  { value: "OUTDOOR_SPACE", label: "Outdoor Space" },
  { value: "OTHER", label: "Other" },
];

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "JPY", label: "JPY — Japanese Yen" },
  { value: "CNY", label: "CNY — Chinese Yuan" },
];

const AMENITY_OPTIONS = [
  "WiFi",
  "Parking",
  "Catering",
  "AV Equipment",
  "Stage",
  "Air Conditioning",
  "Outdoor Area",
  "Bar",
  "Wheelchair Access",
  "Changing Rooms",
  "Projector",
  "Sound System",
  "Lighting Rig",
  "Bridal Suite",
  "Valet Parking",
  "Security",
];


const VenueRegistrationForm = ({ onBack }) => {
  const navigate = useNavigate();

  const [imageInput, setImageInput] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerVenueSchema),
    defaultValues: {
      images: [],
      amenities: [],
    },
  });

  const images = watch("images");

  // ── Images ────────────────────────────────────────────────
  const addImage = () => {
    const url = imageInput.trim();
    if (!url || images.includes(url)) return;
    setValue("images", [...images, url], { shouldValidate: true });
    setImageInput("");
  };

  const removeImage = (url) => {
    setValue(
      "images",
      images.filter((u) => u !== url),
      { shouldValidate: true },
    );
  };

  
  const toggleAmenity = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(updated);
    setValue("amenities", updated);
  };

 
  const onSubmit = async (data) => {
    try {
      const payload = {
        accountType: "VENUE_OWNER",
        name: data.name,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone,
        // ownerId: data.ownerId,
        type: data.type,
        images: data.images,
        description: data.description,
        city: data.city,
        address: data.address,
        capacity: data.capacity,
        price: data.pricePerHour,
        amenities: data.amenities,
        currency: data.currency,
      };

        const response = await venueRegistrationApi(payload);

      console.log(response.data.user, response.data.accessToken);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <p className="sectionTitle">Venue Details</p>

        <div>
          <input
            placeholder="Venue Name"
            {...register("name")}
            className={"inputClass"}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <select {...register("type")} className={"selectClass"}>
              <option value="">Venue Type</option>
              {VENUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              placeholder="Capacity"
              {...register("capacity", { valueAsNumber: true })}
              className={"inputClass"}
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.capacity.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              step="0.01"
              placeholder="Price Per Hour"
              {...register("pricePerHour", { valueAsNumber: true })}
              className={"inputClass"}
            />
            {errors.pricePerHour && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pricePerHour.message}
              </p>
            )}
          </div>
          <div>
            <select {...register("currency")} className={"selectClass"}>
              <option value="">Currency</option>
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currency.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              placeholder="City"
              {...register("city")}
              className={"inputClass"}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <input
              placeholder="Address"
              {...register("address")}
              className={"inputClass"}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <textarea
            placeholder="Description (optional)"
            rows={3}
            {...register("description")}
            className={`${"inputClass"} h-auto py-3`}
          />
        </div>

        <hr className="border-gray-200" />

        <p className="sectionTitle">Images</p>

        <div>
          <div className="flex gap-2">
            <input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              placeholder="Paste image URL and click Add"
              className={"inputClass"}
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 h-12 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition whitespace-nowrap"
            >
              + Add
            </button>
          </div>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {images.map((url) => (
                <span
                  key={url}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600 border border-gray-200"
                >
                  <span className="max-w-[180px] truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="text-gray-400 hover:text-red-500 transition text-sm leading-none"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
          )}
        </div>

        <hr className="border-gray-200" />

        <p className="sectionTitle">
          Amenities{" "}
          <span className="text-xs font-normal text-gray-400">(optional)</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`
                        px-3 py-1.5 rounded-full text-sm border cat-chip transition
                        ${
                          selectedAmenities.includes(amenity)
                            ? "bg-red-50 border-red-400 text-red-600 cat-chip font-medium"
                            : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }
                     `}
            >
              {amenity}
            </button>
          ))}
        </div>

        <hr className="border-gray-200" />

        <p className="sectionTitle">Owner Details</p>

        <div>
          <input
            placeholder="Owner Full Name"
            {...register("ownerName")}
            className={"inputClass"}
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ownerName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="email"
              placeholder="Owner Email"
              {...register("ownerEmail")}
              className={"inputClass"}
            />
            {errors.ownerEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ownerEmail.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Owner Phone"
              {...register("ownerPhone")}
              className={"inputClass"}
            />
            {errors.ownerPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ownerPhone.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-red-600 text-white font-semibold mt-2"
        >
          {isSubmitting ? "Registering Venue..." : "Register Venue"}
        </button>
      </form>
    </>
  );
};

export default VenueRegistrationForm;
