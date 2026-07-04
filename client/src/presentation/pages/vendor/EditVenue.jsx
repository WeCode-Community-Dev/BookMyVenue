import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import AddVenueHeader from "@/presentation/components/vendor/addVenue/AddVenueHeader";
import VenueDetailsForm from "@/presentation/components/vendor/addVenue/VenueDetailsForm";
import AmenitiesForm from "@/presentation/components/vendor/addVenue/AmenitiesForm";
import PricingForm from "@/presentation/components/vendor/addVenue/PricingForm";
import ReviewForm from "@/presentation/components/vendor/addVenue/ReviewForm";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constatnts/apiRoutes";
import { ROUTES } from "@/constatnts/routes";

const EditVenue = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [venueName, setVenueName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [pricing, setPricing] = useState({
    seatingCapacity: "",
    standingCapacity: "",
    pricePerDay: "",
    securityDeposit: "",
    weekendSurcharge: "",
    minimumBookingHours: "",
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const validateForm = () => {
    setSubmissionError("");
    const newErrors = {};
    const totalImages = existingImages.length + images.length;

    if (!venueName.trim()) newErrors.venueName = "Venue name is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    if (!description.trim() || description.trim().length < 10) newErrors.description = "Description must be at least 10 characters.";
    if (!addressLine1.trim()) newErrors.addressLine1 = "Address is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!state.trim()) newErrors.state = "State is required.";
    if (!country.trim()) newErrors.country = "Country is required.";
    if (!phone.trim() || !/^\d{10,15}$/.test(phone.trim())) newErrors.phone = "Phone must be 10-15 digits.";
    if (!pincode.trim() || !/^\d{4,10}$/.test(pincode.trim())) newErrors.pincode = "Pincode must be 4-10 digits.";
    if (websiteUrl.trim() && !/^https?:\/\/.+/.test(websiteUrl.trim())) newErrors.websiteUrl = "Website URL must be valid.";
    if (googleMapLink.trim() && !/^https?:\/\/.+/.test(googleMapLink.trim())) newErrors.googleMapLink = "Google Map link must be valid.";
    if (totalImages < 3) newErrors.images = "Please keep at least 3 images, including existing uploads.";
    if (!pricing.seatingCapacity || Number(pricing.seatingCapacity) < 0) newErrors.seatingCapacity = "Seating capacity must be a non-negative number.";
    if (!pricing.standingCapacity || Number(pricing.standingCapacity) < 0) newErrors.standingCapacity = "Standing capacity must be a non-negative number.";
    if (!pricing.pricePerDay || Number(pricing.pricePerDay) < 0) newErrors.pricePerDay = "Price per day must be a non-negative number.";
    if (!pricing.securityDeposit || Number(pricing.securityDeposit) < 0) newErrors.securityDeposit = "Security deposit must be a non-negative number.";
    if (!pricing.weekendSurcharge || Number(pricing.weekendSurcharge) < 0) newErrors.weekendSurcharge = "Weekend surcharge must be a non-negative number.";
    if (!pricing.minimumBookingHours || Number(pricing.minimumBookingHours) < 0) newErrors.minimumBookingHours = "Minimum booking hours must be a non-negative number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadVenue = async () => {
    setLoading(true);
    setPageError("");

    try {
      const profileResponse = await api.get(API_ROUTES.VENDOR.PROFILE);
      const currentOwnerId = profileResponse?.data?.data?.id;
      if (!currentOwnerId) {
        throw new Error("Unable to determine vendor profile.");
      }
      setOwnerId(currentOwnerId);

      const venueResponse = await api.get(
        API_ROUTES.VENDOR.VENUE.GET_BY_ID
          .replace(":venueId", venueId)
          .replace(":ownerId", currentOwnerId)
      );

      const venue = venueResponse?.data?.data;
      if (!venue) {
        throw new Error("Venue data is unavailable.");
      }

      setVenueName(venue.name || "");
      setCategory(venue.category || "");
      setDescription(venue.description || "");
      setAddressLine1(venue.address?.addressLine1 || "");
      setCity(venue.address?.city || "");
      setState(venue.address?.state || "");
      setCountry(venue.address?.country || "");
      setPhone(venue.address?.phone || "");
      setPincode(venue.address?.pincode || "");
      setWebsiteUrl(venue.websiteUrl || "");
      setGoogleMapLink(venue.address?.googleMapLink || "");
      setAmenities(venue.amenities || []);
      setPricing({
        seatingCapacity: venue.seatingCapacity?.toString() || "",
        standingCapacity: venue.standingCapacity?.toString() || "",
        pricePerDay: venue.pricePerDay?.toString() || "",
        securityDeposit: venue.securityDeposit?.toString() || "",
        weekendSurcharge: venue.weekendSurcharge?.toString() || "",
        minimumBookingHours: venue.minimumBookingHours?.toString() || "",
      });
      setExistingImages(venue.images || []);
      setImages([]);
      setDeletedImages([]);
    } catch (err) {
      console.error(err);
      setPageError(err?.response?.data?.message || err?.message || "Unable to load venue details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (venueId) {
      loadVenue();
    }
  }, [venueId]);

  const handleRemoveExistingImage = (publicId) => {
    setExistingImages((current) => current.filter((image) => image.publicId !== publicId));
    setDeletedImages((current) => [...current, publicId]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!ownerId) {
      setSubmissionError("Vendor owner ID is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("ownerId", ownerId);
    formData.append("name", venueName);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("addressLine1", addressLine1);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("phone", phone);
    formData.append("pincode", pincode);
    formData.append("websiteUrl", websiteUrl);
    formData.append("googleMapLink", googleMapLink);
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("seatingCapacity", pricing.seatingCapacity);
    formData.append("standingCapacity", pricing.standingCapacity);
    formData.append("pricePerDay", pricing.pricePerDay);
    formData.append("securityDeposit", pricing.securityDeposit);
    formData.append("weekendSurcharge", pricing.weekendSurcharge);
    formData.append("minimumBookingHours", pricing.minimumBookingHours);
    formData.append("deletedImages", JSON.stringify(deletedImages));

    images.forEach((image) => formData.append("images", image));

    try {
      await api.patch(API_ROUTES.VENDOR.VENUE.UPDATE.replace(":venueId", venueId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Venue updated successfully!");
      navigate(ROUTES.VENDOR.VENUES);
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.message || "Failed to update venue";
      setSubmissionError(serverMessage);
      console.error(err);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <VendorSidebar />
      <div className="flex-1">
        <VendorNavbar />
        <main className="p-6 space-y-8">
          <AddVenueHeader title="Edit Venue" subtitle="Update the venue details and save changes." />

          {pageError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pageError}
            </div>
          )}

          {submissionError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submissionError}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-gray-500">Loading venue details...</p>
          ) : (
            <>
              <VenueDetailsForm
                venueName={venueName}
                setVenueName={setVenueName}
                category={category}
                setCategory={setCategory}
                description={description}
                setDescription={setDescription}
                addressLine1={addressLine1}
                setAddressLine1={setAddressLine1}
                city={city}
                setCity={setCity}
                state={state}
                setState={setState}
                country={country}
                setCountry={setCountry}
                phone={phone}
                setPhone={setPhone}
                pincode={pincode}
                setPincode={setPincode}
                websiteUrl={websiteUrl}
                setWebsiteUrl={setWebsiteUrl}
                googleMapLink={googleMapLink}
                setGoogleMapLink={setGoogleMapLink}
                images={images}
                setImages={setImages}
                existingImages={existingImages}
                onRemoveExistingImage={handleRemoveExistingImage}
                errors={errors}
              />

              <AmenitiesForm amenities={amenities} setAmenities={setAmenities} />
              <PricingForm pricing={pricing} setPricing={setPricing} errors={errors} />
              <ReviewForm
                venueName={venueName}
                category={category}
                description={description}
                addressLine1={addressLine1}
                city={city}
                state={state}
                country={country}
                pricing={pricing}
                amenities={amenities}
                onPublish={handleSubmit}
                submitLabel="Update Venue"
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditVenue;
