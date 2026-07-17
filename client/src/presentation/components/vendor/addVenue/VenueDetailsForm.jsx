import React, { useEffect, useMemo } from "react";
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
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };
const handleLicenseChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    toast.error("Only PDF files are allowed.");
    e.target.value="";
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
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newImagePreviews]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Venue Details</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Venue Name</label>
          <Input value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Enter venue name" aria-invalid={Boolean(errors.venueName)} />
          {errors.venueName && <p className="mt-2 text-sm text-red-600">{errors.venueName}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={Boolean(errors.category)}
          >
            <option value="">Select category</option>
            {VenueCategory.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Address Line 1</label>
          <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street address" aria-invalid={Boolean(errors.addressLine1)} />
          {errors.addressLine1 && <p className="mt-2 text-sm text-red-600">{errors.addressLine1}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">City</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" aria-invalid={Boolean(errors.city)} />
          {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">State</label>
          <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" aria-invalid={Boolean(errors.state)} />
          {errors.state && <p className="mt-2 text-sm text-red-600">{errors.state}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Country</label>
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" aria-invalid={Boolean(errors.country)} />
          {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" aria-invalid={Boolean(errors.phone)} />
          {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Pincode</label>
          <Input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Postal code" aria-invalid={Boolean(errors.pincode)} />
          {errors.pincode && <p className="mt-2 text-sm text-red-600">{errors.pincode}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Website URL</label>
          <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com" aria-invalid={Boolean(errors.websiteUrl)} />
          {errors.websiteUrl && <p className="mt-2 text-sm text-red-600">{errors.websiteUrl}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Google Map Link</label>
          <Input value={googleMapLink} onChange={(e) => setGoogleMapLink(e.target.value)} placeholder="https://goo.gl/maps/..." aria-invalid={Boolean(errors.googleMapLink)} />
          {errors.googleMapLink && <p className="mt-2 text-sm text-red-600">{errors.googleMapLink}</p>}
        </div>

        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium">Images</label>
          {existingImages.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3">
              {existingImages.map((image) => (
                <div key={image.publicId} className="relative overflow-hidden rounded-2xl border border-slate-200">
                  <img src={image.url} alt="Existing venue" className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage?.(image.publicId)}
                    className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-red-600 shadow-sm"
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
                <div key={preview.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img src={preview.url} alt={preview.name} className="h-28 w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm" aria-invalid={Boolean(errors.images)} />
          {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
        </div>
      </div>
    <div className="col-span-2">
  <label className="block mb-2 text-sm font-medium">
    Business License (PDF)
  </label>

  <input
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

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Describe your venue" />
      </div>
    </div>
  );
};

export default VenueDetailsForm;
