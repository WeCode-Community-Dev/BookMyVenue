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

  // ==============================
  // IMAGES
  // ==============================

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  // ==============================
  // LICENSE
  // ==============================

  const [existingLicense, setExistingLicense] = useState([]);
  const [deletedLicense, setDeletedLicense] = useState([]);
  const [newLicense, setNewLicense] = useState([]);

  // ==============================
  // AMENITIES
  // ==============================

  const [amenities, setAmenities] = useState([]);

  // ==============================
  // PRICING
  // ==============================

  const [pricing, setPricing] = useState({
    seatingCapacity: "",
    standingCapacity: "",
    pricePerHour: "",
    pricePerDay: "",
    securityDeposit: "",
    weekendSurcharge: "",
    minimumBookingHours: "",
  });

  // ==============================
  // VALIDATION ERRORS
  // ==============================

  const [errors, setErrors] = useState({});

  // ==============================
  // FETCH DATA
  // ==============================

  useEffect(() => {
    if (!venueId) return;

    dispatch(fetchVendorProfile());
    dispatch(getVenueById(venueId));
  }, [dispatch, venueId]);

  // ==============================
  // SET VENUE DATA
  // ==============================

  useEffect(() => {
    if (!venue) return;

    setVenueName(venue.name || "");
    setCategory(venue.category || "");
    setDescription(venue.description || "");

    setAddressLine1(
      venue.address?.addressLine1 || ""
    );

    setCity(
      venue.address?.city || ""
    );

    setState(
      venue.address?.state || ""
    );

    setCountry(
      venue.address?.country || ""
    );

    setPhone(
      String(venue.address?.phone || "")
    );

    setPincode(
      String(venue.address?.pincode || "")
    );

    setWebsiteUrl(
      venue.websiteUrl || ""
    );

    setGoogleMapLink(
      venue.address?.googleMapLink || ""
    );

    setAmenities(
      venue.amenities || []
    );

    setPricing({
      seatingCapacity:
        venue.seatingCapacity ?? "",

      standingCapacity:
        venue.standingCapacity ?? "",

      pricePerHour:
        venue.pricePerHour ?? "",

      pricePerDay:
        venue.pricePerDay ?? "",

      securityDeposit:
        venue.securityDeposit ?? "",

      weekendSurcharge:
        venue.weekendSurcharge ?? "",

      minimumBookingHours:
        venue.minimumBookingHours ?? "",
    });

    // Existing Cloudinary images
    setExistingImages(
      venue.images || []
    );

    // Existing Cloudinary license
    setExistingLicense(
      venue.license || []
    );

  }, [venue]);

  // ==============================
  // ERROR DISPLAY
  // ==============================

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong";

      toast.error(errorMessage);
    }
  }, [error]);

  // ==============================
  // REMOVE EXISTING IMAGE
  // ==============================

  const handleRemoveExistingImage = (publicId) => {
    console.log("deleting image with publicId:", publicId);
    setExistingImages((prev) =>
      prev.filter(
        (image) =>
          image.publicId !== publicId
      )
    );

    setDeletedImages((prev) =>
      prev.includes(publicId)
        ? prev
        : [...prev, publicId]
    );
  };

  // ==============================
  // REMOVE EXISTING LICENSE
  // ==============================

  const handleRemoveExistingLicense = (publicId) => {
    setExistingLicense((prev) =>
      prev.filter(
        (license) =>
          license.publicId !== publicId
      )
    );

    setDeletedLicense((prev) =>
      prev.includes(publicId)
        ? prev
        : [...prev, publicId]
    );
  };

  // ==============================
  // HANDLE SUBMIT
  // ==============================

  const handleSubmit = async () => {
    setErrors({});

    // ------------------------------
    // IMAGE VALIDATION
    // ------------------------------

    const totalImages =
      existingImages.length +
      images.length;

    if (totalImages < 3) {
      setErrors({
        images:
          "At least 3 images are required.",
      });

      return;
    }

    // ------------------------------
    // LICENSE VALIDATION
    // ------------------------------

    const totalLicenses =
      existingLicense.length +
      newLicense.length;

    if (totalLicenses === 0) {
      setErrors({
        license:
          "At least one license PDF is required.",
      });

      return;
    }

    // ------------------------------
    // VENDOR VALIDATION
    // ------------------------------

    if (!vendorId) {
      toast.error(
        "Vendor information is not available."
      );

      return;
    }

    // ------------------------------
    // ZOD VALIDATION
    // ------------------------------

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

      seatingCapacity:
        pricing.seatingCapacity,

      standingCapacity:
        pricing.standingCapacity,

      pricePerHour:
        pricing.pricePerHour,

      pricePerDay:
        pricing.pricePerDay,

      securityDeposit:
        pricing.securityDeposit,

      weekendSurcharge:
        pricing.weekendSurcharge,

      minimumBookingHours:
        pricing.minimumBookingHours,

      amenities,

      deletedImages:
        JSON.stringify(deletedImages),

      deletedLicense:
        JSON.stringify(deletedLicense),
    };

    const validationResult =
      editVenueSchema.safeParse(
        formValues
      );

    if (!validationResult.success) {
      const fieldErrors = {};

      validationResult.error.issues.forEach(
        (issue) => {
          const fieldName =
            issue.path[0];

          fieldErrors[fieldName] =
            issue.message;
        }
      );

      setErrors(fieldErrors);

      return;
    }

    // ==============================
    // CREATE FORM DATA
    // ==============================

    const formData = new FormData();

    // Basic details
    formData.append(
      "name",
      venueName
    );

    formData.append(
      "description",
      description
    );

    formData.append(
      "category",
      category
    );

    formData.append(
      "vendorId",
      vendorId
    );

    // Links
    formData.append(
      "websiteUrl",
      websiteUrl
    );

    formData.append(
      "googleMapLink",
      googleMapLink
    );

    // Address
    formData.append(
      "addressLine1",
      addressLine1
    );

    formData.append(
      "city",
      city
    );

    formData.append(
      "state",
      state
    );

    formData.append(
      "country",
      country
    );

    // IMPORTANT:
    // These values are sent unchanged.
    // If you want them to be non-editable,
    // disable the inputs in VenueDetailsForm.
    formData.append(
      "phone",
      phone
    );

    formData.append(
      "pincode",
      pincode
    );

    // Pricing
    formData.append(
      "seatingCapacity",
      pricing.seatingCapacity
    );

    formData.append(
      "standingCapacity",
      pricing.standingCapacity
    );

    formData.append(
      "pricePerHour",
      pricing.pricePerHour
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

    // Amenities
    formData.append(
      "amenities",
      JSON.stringify(amenities)
    );

    // Deleted existing images
    formData.append(
      "deletedImages",
      JSON.stringify(deletedImages)
    );

    // Deleted existing licenses
    formData.append(
      "deletedLicense",
      JSON.stringify(deletedLicense)
    );

    // New images
    images.forEach((image) => {
      formData.append(
        "images",
        image
      );
    });

    // New license
    newLicense.forEach((license) => {
      formData.append(
        "license",
        license
      );
    });

    // ==============================
    // UPDATE
    // ==============================

    try {
      await dispatch(
        updateVenue({
          venueId,
          formData,
        })
      ).unwrap();

      toast.success(
        "Venue updated successfully!"
      );

      dispatch(
        clearVenueState()
      );

      navigate(
        ROUTES.VENDOR.VENUES
      );

    } catch (err) {

      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message ||
            "Failed to update venue";

      toast.error(
        errorMessage
      );
    }
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

          {/* Do not render the entire error object */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {typeof error === "string"
                ? error
                : error?.message ||
                  "Something went wrong"}
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

                // Images
                images={images}
                setImages={setImages}

                existingImages={existingImages}
                onRemoveExistingImage={
                  handleRemoveExistingImage
                }

                // License
                existingLicense={existingLicense}
                onRemoveExistingLicense={
                  handleRemoveExistingLicense
                }

                newLicense={newLicense}
                setNewLicense={setNewLicense}

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