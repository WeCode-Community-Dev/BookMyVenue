import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import AddVenueHeader from "@/presentation/components/vendor/addVenue/AddVenueHeader";
import VenueDetailsForm from "@/presentation/components/vendor/addVenue/VenueDetailsForm";
import AmenitiesForm from "@/presentation/components/vendor/addVenue/AmenitiesForm";
import PricingForm from "@/presentation/components/vendor/addVenue/PricingForm";
import ReviewForm from "@/presentation/components/vendor/addVenue/ReviewForm";

import { ROUTES } from "@/constants/routes";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchVendorProfile,
  getVenueById,
  updateVenue,
  clearVenueState,
} from "@/redux/slices/VendorVenueSlice";

import toast from "react-hot-toast";

const EditVenue = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { venueId } = useParams();

  const {
    venue,
    ownerId,
    loading,
    success,
    error,
  } = useSelector((state) => state.vendorVenue);

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

  useEffect(() => {
    dispatch(fetchVendorProfile());
    dispatch(getVenueById(venueId));
  }, [dispatch, venueId]);

  useEffect(() => {
    if (!venue) return;

    setVenueName(venue.name || "");
    setCategory(venue.category || "");
    setDescription(venue.description || "");

    setAddressLine1(venue.address?.addressLine1 || "");
    setCity(venue.address?.city || "");
    setState(venue.address?.state || "");
    setCountry(venue.address?.country || "");

    setPhone(venue.phone || "");
    setPincode(venue.pincode || "");
    setWebsiteUrl(venue.websiteUrl || "");
    setGoogleMapLink(venue.googleMapLink || "");

    setAmenities(venue.amenities || []);

    setPricing({
      seatingCapacity: venue.seatingCapacity || "",
      standingCapacity: venue.standingCapacity || "",
      pricePerDay: venue.pricePerDay || "",
      securityDeposit: venue.securityDeposit || "",
      weekendSurcharge: venue.weekendSurcharge || "",
      minimumBookingHours: venue.minimumBookingHours || "",
    });

    setExistingImages(venue.images || []);
  }, [venue]);

  useEffect(() => {
    if (success) {
      toast.success("Venue updated successfully");

      dispatch(clearVenueState());

      navigate(ROUTES.OWNER.VENUE.GET_ALL);
    }

    if (error) {
      toast.error(error);

      dispatch(clearVenueState());
    }
  }, [success, error, dispatch, navigate]);

  const handleRemoveExistingImage = (publicId) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.publicId !== publicId)
    );

    setDeletedImages((prev) => [...prev, publicId]);
  };

  const validateForm = () => {
    setSubmissionError("");

    const newErrors = {};

    const totalImages =
      existingImages.length + images.length;

    if (!venueName.trim())
      newErrors.venueName = "Venue name is required.";

    if (!category.trim())
      newErrors.category = "Category is required.";

    if (
      !description.trim() ||
      description.trim().length < 10
    )
      newErrors.description =
        "Description must be at least 10 characters.";

    if (!addressLine1.trim())
      newErrors.addressLine1 = "Address is required.";

    if (!city.trim())
      newErrors.city = "City is required.";

    if (!state.trim())
      newErrors.state = "State is required.";

    if (!country.trim())
      newErrors.country = "Country is required.";

    if (
      !phone.trim() ||
      !/^\d{10,15}$/.test(phone.trim())
    )
      newErrors.phone =
        "Phone must be 10-15 digits.";

    if (
      !pincode.trim() ||
      !/^\d{4,10}$/.test(pincode.trim())
    )
      newErrors.pincode =
        "Pincode must be 4-10 digits.";

    if (
      websiteUrl.trim() &&
      !/^https?:\/\/.+/.test(websiteUrl.trim())
    )
      newErrors.websiteUrl =
        "Website URL is invalid.";

    if (
      googleMapLink.trim() &&
      !/^https?:\/\/.+/.test(
        googleMapLink.trim()
      )
    )
      newErrors.googleMapLink =
        "Google Map URL is invalid.";

    if (totalImages < 3)
      newErrors.images =
        "At least 3 images are required.";

    if (
      !pricing.seatingCapacity ||
      Number(pricing.seatingCapacity) < 0
    )
      newErrors.seatingCapacity =
        "Invalid seating capacity.";

    if (
      !pricing.standingCapacity ||
      Number(pricing.standingCapacity) < 0
    )
      newErrors.standingCapacity =
        "Invalid standing capacity.";

    if (
      !pricing.pricePerDay ||
      Number(pricing.pricePerDay) < 0
    )
      newErrors.pricePerDay =
        "Invalid price.";

    if (
      !pricing.securityDeposit ||
      Number(pricing.securityDeposit) < 0
    )
      newErrors.securityDeposit =
        "Invalid security deposit.";

    if (
      !pricing.weekendSurcharge ||
      Number(pricing.weekendSurcharge) < 0
    )
      newErrors.weekendSurcharge =
        "Invalid weekend surcharge.";

    if (
      !pricing.minimumBookingHours ||
      Number(pricing.minimumBookingHours) < 0
    )
      newErrors.minimumBookingHours =
        "Invalid booking hours.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!ownerId) {
      setSubmissionError(
        "Vendor profile not loaded."
      );

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

    formData.append(
      "amenities",
      JSON.stringify(amenities)
    );

    formData.append(
      "seatingCapacity",
      pricing.seatingCapacity
    );

    formData.append(
      "standingCapacity",
      pricing.standingCapacity
    );

    formData.append(
      "pricePerDay",
      pricing.pricePerDay
    );

    formData.append(
      "securityDeposit",
      pricing.securityDeposit
    );

    formData.append(
      "weekendSurcharge",
      pricing.weekendSurcharge
    );

    formData.append(
      "minimumBookingHours",
      pricing.minimumBookingHours
    );

    formData.append(
      "deletedImages",
      JSON.stringify(deletedImages)
    );

    images.forEach((image) =>
      formData.append("images", image)
    );

    try {
      await dispatch(
        updateVenue({
          venueId,
          formData,
        })
      ).unwrap();
    } catch (err) {
      setSubmissionError(err);
    }
  };

    return (
    <div className="flex bg-slate-50 min-h-screen">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6 space-y-8">
          <AddVenueHeader
            title="Edit Venue"
            subtitle="Update your venue information."
          />

          {submissionError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submissionError}
            </div>
          )}

          {loading && !venue ? (
            <div className="rounded-xl bg-white p-8 text-center">
              Loading venue details...
            </div>
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

              <AmenitiesForm
                amenities={amenities}
                setAmenities={setAmenities}
              />

              <PricingForm
                pricing={pricing}
                setPricing={setPricing}
                errors={errors}
              />

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
                loading={loading}
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