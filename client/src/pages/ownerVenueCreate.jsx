import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVenueImages } from "../services/uploadService.js";
import { createOwnerVenue } from "../services/ownerVenueService.js";
import { usePageTitle } from "../hooks/usePageTitle.js";

function OwnerVenueCreate() {
    usePageTitle("Submit Venue");
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            setError("You can upload a maximum of 5 images.");
            return;
        }

        const hasLargeFile = files.some((file) => file.size > 5 * 1024 * 1024);

        if (hasLargeFile) {
            setError("Each image must be less than 5 MB.");
            return;
        }

        setError("");
        setImageFiles(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const convertCommaTextToArray = (text) => {
        return text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setUploadingImages(true);
            setError("");

            const latitude = Number(formData.latitude);
            const longitude = Number(formData.longitude);

            if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
                setError("Latitude and longitude must be valid numbers.");
                return;
            }

            let uploadedImageUrls = [];

            if (imageFiles.length > 0) {
                const uploadResult = await uploadVenueImages(imageFiles);

                uploadedImageUrls = uploadResult.data.map((image) => image.url);
            }

            setUploadingImages(false);

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

                capacity: Number(formData.capacity),

                pricing: {
                    basePrice: Number(formData.basePrice),
                    currency: "INR",
                    pricingModel: formData.pricingModel,
                },

                amenities: convertCommaTextToArray(formData.amenities),
                images: uploadedImageUrls,

                contactInfo: {
                    phone: formData.phone,
                    email: formData.email,
                    website: formData.website,
                },
            };

            await createOwnerVenue(venueData);

            navigate("/owner/venues", {
                replace: true,
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit venue");
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

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
                        Submit Your Venue
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Add your venue details. Admin approval is required before it becomes public.
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
                                        placeholder="Royal Convention Hall"
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
                                        placeholder="Describe your venue, facilities, and suitable events."
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
                                        placeholder="Ernakulam"
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
                                        placeholder="Kochi"
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
                                        placeholder="Full venue address"
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
                                        placeholder="9.9312"
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
                                        placeholder="76.2673"
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
                                        placeholder="500"
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
                                        placeholder="50000"
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
                                        rows="5"
                                        placeholder="Parking, Wi-Fi, AC Hall, Stage, Catering"
                                        className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Separate amenities with commas.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Venue Images
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                                    />

                                    <p className="text-sm text-gray-500 mt-2">
                                        Upload up to 5 images. Each image should be below 5 MB.
                                    </p>

                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                            {imagePreviews.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Venue preview ${index + 1}`}
                                                    className="h-32 w-full object-cover rounded-xl border"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                        placeholder="9876543210"
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
                                        placeholder="owner@example.com"
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
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-[#8b1e2d] to-[#4a1625] hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {uploadingImages
                                ? "Uploading Images..."
                                : loading
                                    ? "Submitting Venue..."
                                    : "Submit Venue for Approval"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default OwnerVenueCreate;