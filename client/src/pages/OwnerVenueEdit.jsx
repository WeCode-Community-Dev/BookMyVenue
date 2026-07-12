import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getOwnerVenueById,
  updateOwnerVenue,
} from "../services/ownerVenueService";

import { uploadVenueImages } from "../services/uploadService";
import { usePageTitle } from "../hooks/usePageTitle";

function OwnerVenueEdit() {
  usePageTitle("Update Venue");
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    district: "",
    town: "",
    address: "",
    latitude: "",
    longitude: "",
    capacity: "",
    basePrice: "",
    pricingModel: "per_day",
    amenities: "",
    phone: "",
    email: "",
    website: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadVenue = async () => {
      try {
        const result = await getOwnerVenueById(id);
        const venue = result.data;

        if (isMounted) {
          setFormData({
            name: venue.name || "",
            description: venue.description || "",
            category: venue.category || "",
            district: venue.district || "",
            town: venue.town || "",
            address: venue.address || "",
            latitude: venue.location?.coordinates?.[1] || "",
            longitude: venue.location?.coordinates?.[0] || "",
            capacity: venue.capacity || "",
            basePrice: venue.pricing?.basePrice || "",
            pricingModel: venue.pricing?.pricingModel || "per_day",
            amenities: venue.amenities?.join(", ") || "",
            phone: venue.contactInfo?.phone || "",
            email: venue.contactInfo?.email || "",
            website: venue.contactInfo?.website || "",
          });

          setExistingImages(venue.images || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch venue");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVenue();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const convertCommaTextToArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError("You can upload a maximum of 5 new images.");
      return;
    }

    const hasLargeFile = files.some((file) => file.size > 5 * 1024 * 1024);

    if (hasLargeFile) {
      setError("Each image must be less than 5 MB.");
      return;
    }

    setError("");
    setNewImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((image) => image !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      setError("");

      const latitude = Number(formData.latitude);
      const longitude = Number(formData.longitude);
      const capacity = Number(formData.capacity);
      const basePrice = Number(formData.basePrice);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        setError("Latitude and longitude must be valid numbers.");
        return;
      }

      if (Number.isNaN(capacity) || capacity < 1) {
        setError("Capacity must be a valid number.");
        return;
      }

      if (Number.isNaN(basePrice) || basePrice < 0) {
        setError("Starting price must be a valid number.");
        return;
      }

      let uploadedNewImageUrls = [];

      if (newImageFiles.length > 0) {
        setUploadingImages(true);

        const uploadResult = await uploadVenueImages(newImageFiles);

        uploadedNewImageUrls = uploadResult.data.map((image) => image.url);

        setUploadingImages(false);
      }

      const finalImages = [...existingImages, ...uploadedNewImageUrls];

      const venueData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        district: formData.district,
        town: formData.town,
        address: formData.address,

        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },

        capacity,

        pricing: {
          basePrice,
          currency: "INR",
          pricingModel: formData.pricingModel,
        },

        amenities: convertCommaTextToArray(formData.amenities),

        images: finalImages,

        contactInfo: {
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
        },
      };

      await updateOwnerVenue(id, venueData);

      navigate("/owner/venues", {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update venue");
    } finally {
      setSubmitLoading(false);
      setUploadingImages(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading venue details...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#faf7f5] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-[#8b1e2d] font-medium hover:underline"
        >
          ← Back
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-[#4a1625]">
            Update Venue
          </h1>

          <p className="text-gray-500 mt-2">
            After updating, the venue will be sent for admin approval again.
          </p>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#4a1625] mb-4">
                Basic Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="banquet hall">Banquet Hall</option>
                    <option value="auditorium">Auditorium</option>
                    <option value="convention center">Convention Center</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="rooftop">Rooftop</option>
                    <option value="resort">Resort</option>
                    <option value="hotel ballroom">Hotel Ballroom</option>
                    <option value="community hall">Community Hall</option>
                    <option value="wedding hall">Wedding Hall</option>
                    <option value="conference room">Conference Room</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#4a1625] mb-4">
                Location
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Town / Area
                  </label>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#4a1625] mb-4">
                Capacity & Pricing
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Starting Price
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Pricing Model
                  </label>
                  <select
                    name="pricingModel"
                    value={formData.pricingModel}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  >
                    <option value="per_day">Per Day</option>
                    <option value="per_hour">Per Hour</option>
                    <option value="per_event">Per Event</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#4a1625] mb-4">
                Amenities & Images
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Amenities
                  </label>
                  <textarea
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Parking, Wi-Fi, AC Hall, Stage"
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Separate amenities with commas.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Add New Images
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImageChange}
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />

                  <p className="text-sm text-gray-500 mt-2">
                    Optional. Upload new images only if you want to add/replace venue photos.
                  </p>
                </div>
              </div>

              {existingImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Existing Images
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image) => (
                      <div key={image} className="relative">
                        <img
                          src={image}
                          alt="Existing venue"
                          className="h-32 w-full object-cover rounded-xl border"
                        />

                        <button
                          type="button"
                          onClick={() => removeExistingImage(image)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newImagePreviews.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    New Image Preview
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`New venue preview ${index + 1}`}
                        className="h-32 w-full object-cover rounded-xl border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#4a1625] mb-4">
                Contact Details
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-[#8b1e2d] to-[#4a1625] hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploadingImages
                ? "Uploading Images..."
                : submitLoading
                ? "Updating Venue..."
                : "Update Venue"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default OwnerVenueEdit;