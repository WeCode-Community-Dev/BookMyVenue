import { useEffect, useState } from "react";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
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


const AddVenue = () => {
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
  const [license,setLicense] = useState(null);

  const dispatch = useDispatch();

  const {
    ownerId,
    loading,
    success,
    error,
  } = useSelector((state) => state.vendorVenue);
  

useEffect(() => {
  dispatch(fetchVendorProfile());
}, [dispatch]);

useEffect(() => {
if (success) {
  toast.success("Venue created successfully!");

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
    pricePerDay: "",
    securityDeposit: "",
    weekendSurcharge: "",
    minimumBookingHours: "",
  });

  dispatch(clearVenueState());
}
  if (error) {
    toast.error(error);

    dispatch(clearVenueState());
  }
}, [success, error, dispatch]);


const validateForm = () => {
    setSubmissionError("");
    const newErrors = {};

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
    if (images.length < 3) newErrors.images = "Upload at least 3 images.";
    if (license && license.type !== "application/pdf") {
  newErrors.license = "Only PDF files are allowed.";
}
    
    if (!pricing.seatingCapacity || Number(pricing.seatingCapacity) < 0) newErrors.seatingCapacity = "Seating capacity must be a non-negative number.";
    if (!pricing.standingCapacity || Number(pricing.standingCapacity) < 0) newErrors.standingCapacity = "Standing capacity must be a non-negative number.";
    if (!pricing.pricePerDay || Number(pricing.pricePerDay) < 0) newErrors.pricePerDay = "Price per day must be a non-negative number.";
    if (!pricing.securityDeposit || Number(pricing.securityDeposit) < 0) newErrors.securityDeposit = "Security deposit must be a non-negative number.";
    if (!pricing.weekendSurcharge || Number(pricing.weekendSurcharge) < 0) newErrors.weekendSurcharge = "Weekend surcharge must be a non-negative number.";
    if (!pricing.minimumBookingHours || Number(pricing.minimumBookingHours) < 0) newErrors.minimumBookingHours = "Minimum booking hours must be a non-negative number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("seatingCapacity", pricing.seatingCapacity);
    formData.append("standingCapacity", pricing.standingCapacity);
    formData.append("pricePerDay", pricing.pricePerDay);
    formData.append("securityDeposit", pricing.securityDeposit);
    formData.append("weekendSurcharge", pricing.weekendSurcharge);
    formData.append("minimumBookingHours", pricing.minimumBookingHours);

    if (!ownerId) {
      setSubmissionError("Unable to create venue before profile loads.");
      return;
    }
    if (license) {
  formData.append("license", license);
}

    formData.append("vendorId", ownerId);
    formData.append("ownerId", ownerId);
    images.forEach((image) => formData.append("images", image));

try {
  await dispatch(createVenue(formData)).unwrap();
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
          <AddVenueHeader />

          {submissionError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submissionError}
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
            loading={loading}
            submitLabel="Publish Venue"
          />
        </main>
      </div>
    </div>
  );
};

export default AddVenue;
