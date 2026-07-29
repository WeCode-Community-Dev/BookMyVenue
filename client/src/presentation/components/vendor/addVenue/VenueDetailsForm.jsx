import { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VenueCategory } from "@/constants/Venue";

const VenueDetailsForm = ({
  venueName,
  setVenueName,
  category,
  setCategory,
  description,
  setDescription,
  addressLine1,
  setAddressLine1,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  phone,
  setPhone,
  pincode,
  setPincode,
  websiteUrl,
  setWebsiteUrl,
  googleMapLink,
  setGoogleMapLink,
  images,
  setImages,
  license,
  setLicense,
  existingImages = [],
  onRemoveExistingImage,
  errors = {},
}) => {
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    setImages(files);
  };

  const handleLicenseChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");

      event.target.value = "";
      setLicense(null);

      return;
    }

    setLicense(file);
  };

  const newImagePreviews = useMemo(() => {
    return images.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [newImagePreviews]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Venue Details
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Venue Name */}
        <div>
          <label
            htmlFor="venueName"
            className="mb-2 block text-sm font-medium"
          >
            Venue Name
          </label>

          <Input
            id="venueName"
            value={venueName}
            onChange={(event) =>
              setVenueName(event.target.value)
            }
            placeholder="Enter venue name"
            aria-invalid={Boolean(errors.venueName)}
          />

          {errors.venueName && (
            <p className="mt-2 text-sm text-red-600">
              {errors.venueName}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium"
          >
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Select category</option>

            {Object.values(VenueCategory).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="mt-2 text-sm text-red-600">
              {errors.category}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="addressLine1"
            className="mb-2 block text-sm font-medium"
          >
            Address Line 1
          </label>

          <Input
            id="addressLine1"
            value={addressLine1}
            onChange={(event) =>
              setAddressLine1(event.target.value)
            }
            placeholder="Street address"
            aria-invalid={Boolean(errors.addressLine1)}
          />

          {errors.addressLine1 && (
            <p className="mt-2 text-sm text-red-600">
              {errors.addressLine1}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-medium"
          >
            City
          </label>

          <Input
            id="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="City"
            aria-invalid={Boolean(errors.city)}
          />

          {errors.city && (
            <p className="mt-2 text-sm text-red-600">
              {errors.city}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-medium"
          >
            State
          </label>

          <Input
            id="state"
            value={state}
            onChange={(event) => setState(event.target.value)}
            placeholder="State"
            aria-invalid={Boolean(errors.state)}
          />

          {errors.state && (
            <p className="mt-2 text-sm text-red-600">
              {errors.state}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-medium"
          >
            Country
          </label>

          <Input
            id="country"
            value={country}
            onChange={(event) =>
              setCountry(event.target.value)
            }
            placeholder="Country"
            aria-invalid={Boolean(errors.country)}
          />

          {errors.country && (
            <p className="mt-2 text-sm text-red-600">
              {errors.country}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium"
          >
            Phone
          </label>

          <Input
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter phone number"
            aria-invalid={Boolean(errors.phone)}
          />

          {errors.phone && (
            <p className="mt-2 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label
            htmlFor="pincode"
            className="mb-2 block text-sm font-medium"
          >
            Pincode
          </label>

          <Input
            id="pincode"
            value={pincode}
            onChange={(event) =>
              setPincode(event.target.value)
            }
            placeholder="Postal code"
            aria-invalid={Boolean(errors.pincode)}
          />

          {errors.pincode && (
            <p className="mt-2 text-sm text-red-600">
              {errors.pincode}
            </p>
          )}
        </div>

        {/* Website */}
        <div>
          <label
            htmlFor="websiteUrl"
            className="mb-2 block text-sm font-medium"
          >
            Website URL
          </label>

          <Input
            id="websiteUrl"
            value={websiteUrl}
            onChange={(event) =>
              setWebsiteUrl(event.target.value)
            }
            placeholder="https://example.com"
            aria-invalid={Boolean(errors.websiteUrl)}
          />

          {errors.websiteUrl && (
            <p className="mt-2 text-sm text-red-600">
              {errors.websiteUrl}
            </p>
          )}
        </div>

        {/* Google Map */}
        <div>
          <label
            htmlFor="googleMapLink"
            className="mb-2 block text-sm font-medium"
          >
            Google Map Link
          </label>

          <Input
            id="googleMapLink"
            value={googleMapLink}
            onChange={(event) =>
              setGoogleMapLink(event.target.value)
            }
            placeholder="https://goo.gl/maps/..."
            aria-invalid={Boolean(errors.googleMapLink)}
          />

          {errors.googleMapLink && (
            <p className="mt-2 text-sm text-red-600">
              {errors.googleMapLink}
            </p>
          )}
        </div>

        {/* Images */}
        <div className="col-span-2">
          <label
            htmlFor="images"
            className="mb-2 block text-sm font-medium"
          >
            Images
          </label>

          {existingImages.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3">
              {existingImages.map((image) => (
                <div
                  key={image.publicId}
                  className="relative overflow-hidden rounded-2xl border border-slate-200"
                >
                  <img
                    src={image.url}
                    alt="Existing venue"
                    className="h-28 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      onRemoveExistingImage?.(image.publicId)
                    }
                    className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-red-600 shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {newImagePreviews.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3">
              {newImagePreviews.map((preview) => (
                <div
                  key={preview.name}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="h-28 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm"
            aria-invalid={Boolean(errors.images)}
          />

          {errors.images && (
            <p className="mt-2 text-sm text-red-600">
              {errors.images}
            </p>
          )}
        </div>

        {/* Business License */}
        <div className="col-span-2">
          <label
            htmlFor="license"
            className="mb-2 block text-sm font-medium"
          >
            Business License (PDF)
          </label>

          <input
            id="license"
            type="file"
            accept=".pdf"
            onChange={handleLicenseChange}
            className="block w-full text-sm"
            aria-invalid={Boolean(errors.license)}
          />

          {license && (
            <div className="mt-2 rounded-lg border bg-slate-50 p-3">
              <p className="text-sm text-green-700">
                📄 {license.name}
              </p>
            </div>
          )}

          {errors.license && (
            <p className="mt-2 text-sm text-red-600">
              {errors.license}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium"
        >
          Description
        </label>

        <Textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={5}
          placeholder="Describe your venue"
          aria-invalid={Boolean(errors.description)}
        />

        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default VenueDetailsForm;