import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";

import AddVenueHeader from "@/presentation/components/vendor/addVenue/AddVenueHeader";
import VenueDetailsForm from "@/presentation/components/vendor/addVenue/VenueDetailsForm";
import AmenitiesForm from "@/presentation/components/vendor/addVenue/AmenitiesForm";
import PricingForm from "@/presentation/components/vendor/addVenue/PricingForm";
import ReviewForm from "@/presentation/components/vendor/addVenue/ReviewForm";

import { ROUTES } from "@/constants/routes";

import {
  fetchVendorProfile,
  getVenueById,
  updateVenue,
  clearVenueState,
} from "@/redux/slices/VendorVenueSlice";

import { editVenueSchema } from "@/lib/validation/venueValidation";

const EditVenue = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { venueId } = useParams();

  // ==============================
  // REDUX STATE
  // ==============================

  const {
    venue,
    vendorId,
    loading,
    success,
    error,
  } = useSelector((state) => state.vendorVenue);

  // ==============================
  // FORM STATE
  // ==============================

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

  // New images selected by the user
  const [images, setImages] = useState([]);

  // Images already stored in backend
  const [existingImages, setExistingImages] = useState([]);

  // Public IDs of images removed by the user
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

  // ==============================
  // FETCH PROFILE AND VENUE
  // ==============================

  useEffect(() => {
    dispatch(fetchVendorProfile());
    dispatch(getVenueById(venueId));
  }, [dispatch, venueId]);

  // ==============================
  // SET VENUE DATA INTO FORM
  // ==============================

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
      seatingCapacity: venue.seatingCapacity ?? "",
      standingCapacity: venue.standingCapacity ?? "",
      pricePerDay: venue.pricePerDay ?? "",
      securityDeposit: venue.securityDeposit ?? "",
      weekendSurcharge: venue.weekendSurcharge ?? "",
      minimumBookingHours: venue.minimumBookingHours ?? "",
    });

    setExistingImages(venue.images || []);
  }, [venue]);

  // ==============================
  // SUCCESS / ERROR
  // ==============================

  useEffect(() => {
    if (success) {
      toast.success("Venue updated successfully!");

      dispatch(clearVenueState());

      navigate(ROUTES.OWNER.VENUE.GET_ALL);
    }

    if (error) {
      toast.error(error);

      dispatch(clearVenueState());
    }
  }, [success, error, dispatch, navigate]);

  // ==============================
  // REMOVE EXISTING IMAGE
  // ==============================

  const handleRemoveExistingImage = (publicId) => {
    setExistingImages((prev) =>
      prev.filter((image) => image.publicId !== publicId)
    );

    setDeletedImages((prev) => [...prev, publicId]);
  };

  // ==============================
  // HANDLE SUBMIT
  // ==============================

  const handleSubmit = async () => {
    setErrors({});

    // Backend requires at least 3 images.
    // Existing images + newly selected images
    const totalImages =
      existingImages.length + images.length;

    if (totalImages < 3) {
      setErrors({
        images: "At least 3 images are required.",
      });

      return;
    }

    if (!vendorId) {
      return;
    }

    // ==============================
    // FORM VALUES
    // ==============================

    const formValues = {
      name: venueName,
      description,
      category,

      vendorId,

      websiteUrl,

      addressLine1,
      city,
      state,
      country,

      phone,
      pincode,

      googleMapLink,

      seatingCapacity: pricing.seatingCapacity,
      standingCapacity: pricing.standingCapacity,

      pricePerDay: pricing.pricePerDay,
      securityDeposit: pricing.securityDeposit,
      weekendSurcharge: pricing.weekendSurcharge,
      minimumBookingHours: pricing.minimumBookingHours,

      amenities,

      deletedImages: JSON.stringify(deletedImages),
    };

    // ==============================
    // ZOD VALIDATION
    // ==============================

    const result =
      editVenueSchema.safeParse(formValues);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        fieldErrors[fieldName] = issue.message;
      });

      setErrors(fieldErrors);

      return;
    }

    // ==============================
    // CREATE FORM DATA
    // ==============================

    const formData = new FormData();

    formData.append("name", venueName);
    formData.append("description", description);
    formData.append("category", category);

    formData.append("vendorId", vendorId);

    formData.append("websiteUrl", websiteUrl);

    formData.append("addressLine1", addressLine1);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);

    formData.append("phone", phone);
    formData.append("pincode", pincode);

    formData.append("googleMapLink", googleMapLink);

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
      "amenities",
      JSON.stringify(amenities)
    );

    formData.append(
      "deletedImages",
      JSON.stringify(deletedImages)
    );

    // New images
    images.forEach((image) => {
      formData.append("images", image);
    });

    // ==============================
    // UPDATE VENUE
    // ==============================

    await dispatch(
      updateVenue({
        venueId,
        formData,
      })
    );
  };

  // ==============================
  // UI
  // ==============================

  return (
    <div className="flex min-h-screen bg-slate-50">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="space-y-8 p-6">
          <AddVenueHeader
            title="Edit Venue"
            subtitle="Update your venue information."
          />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
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
                onRemoveExistingImage={
                  handleRemoveExistingImage
                }
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

