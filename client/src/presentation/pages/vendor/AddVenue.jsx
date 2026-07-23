import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import { ROUTES } from "@/constants/routes";

import AddVenueHeader from "@/presentation/components/vendor/addVenue/AddVenueHeader";
import VenueDetailsForm from "@/presentation/components/vendor/addVenue/VenueDetailsForm";
import AmenitiesForm from "@/presentation/components/vendor/addVenue/AmenitiesForm";
import PricingForm from "@/presentation/components/vendor/addVenue/PricingForm";
import ReviewForm from "@/presentation/components/vendor/addVenue/ReviewForm";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchVendorProfile,
  createVenue,
  clearVenueState,
} from "@/redux/slices/VendorVenueSlice";

import { createVenueSchema } from "@/lib/validation/venueValidation";

const AddVenue = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const [license, setLicense] = useState(null);

  const [pricing, setPricing] = useState({
    seatingCapacity: "",
    standingCapacity: "",
    pricePerHour:"",
    pricePerDay: "",
    securityDeposit: "",
    weekendSurcharge: "",
    minimumBookingHours: "",
  });

  // Client-side validation errors
  const [errors, setErrors] = useState({});

  // ==============================
  // REDUX STATE
  // ==============================

  const {
    //vendorId,
    loading,
    success,
    error,
  } = useSelector((state) => state.vendorVenue);

  // ==============================
  // FETCH VENDOR PROFILE
  // ==============================

  useEffect(() => {
    dispatch(fetchVendorProfile());

    return () => {
      dispatch(clearVenueState());
    };
  }, [dispatch]);

  // ==============================
  // RESET FORM
  // ==============================

  const resetForm = () => {
    setVenueName("");
    setCategory("");
    setDescription("");

    setAddressLine1("");
    setCity("");
    setState("");
    setCountry("");

    setPhone("");
    setPincode("");

    setWebsiteUrl("");
    setGoogleMapLink("");

    setImages([]);
    setAmenities([]);
    setLicense(null);

    setPricing({
      seatingCapacity: "",
      standingCapacity: "",
      pricePerHour:"",
      pricePerDay: "",
      securityDeposit: "",
      weekendSurcharge: "",
      minimumBookingHours: "",
    });

    setErrors({});
  };

  // ==============================
  // HANDLE SUBMIT
  // ==============================

  const handleSubmit = async () => {
    setErrors({});

    const formValues = {
      name: venueName,
      category,
      description,

      addressLine1,
      city,
      state,
      country,

      phone,
      pincode,

      websiteUrl,
      googleMapLink,

      seatingCapacity: pricing.seatingCapacity,
      standingCapacity: pricing.standingCapacity,
      pricePerHour: pricing.pricePerHour,
      pricePerDay: pricing.pricePerDay,
      securityDeposit: pricing.securityDeposit,
      weekendSurcharge: pricing.weekendSurcharge,
      minimumBookingHours: pricing.minimumBookingHours,

      amenities,
      images,
      license,
    };

    // ==============================
    // ZOD VALIDATION
    // ==============================

    const result = createVenueSchema.safeParse(formValues);

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
    // VENDOR VALIDATION
    // ==============================

   // if (!vendorId) {
     // toast.error("Vendor profile is still loading.");

     // return;
   // }

    // ==============================
    // FORM DATA
    // ==============================

    const formData = new FormData();

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
    "pricePerHour",
    String(pricing.pricePerHour)
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

   // formData.append("vendorId", vendorId);

    if (license) {
      formData.append("license", license);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    // ==============================
    // DISPATCH THUNK
    // ==============================

    try {
      await dispatch(createVenue(formData)).unwrap();

      toast.success("Venue created successfully!");

      resetForm();

      dispatch(clearVenueState());
      navigate(ROUTES.VENDOR.VENUES);

} 
catch (errorMessage) {
  toast.error(
    typeof errorMessage === "string"
      ? errorMessage
      : errorMessage?.message || "Failed to create venue"
  );
}  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      <VendorSidebar />

      <div className="flex-1">

        <VendorNavbar />

        <main className="space-y-8 p-6">

          <AddVenueHeader />

{error && (
  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {typeof error === "string"
      ? error
      : error?.message || "Something went wrong"}
  </div>
)}
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

            license={license}
            setLicense={setLicense}

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
            onPublish={handleSubmit}
            loading={loading}
            submitLabel="Publish Venue"
          />

        </main>

      </div>

    </div>
  );
};

export default AddVenue;