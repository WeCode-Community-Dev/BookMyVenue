import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiCheck, FiTrash2, FiPlus, FiUpload } from "react-icons/fi";
import "./addVenue.scss";
import { useAddVenueMutation, useGetAmenitiesQuery } from "./ownerApi.js";
import PageTransition from "../../components/ui/PageTransition";
import MapView from "../../components/map/Mapview.jsx";
import LocationPicker from "../../components/map/LocationPicker.jsx";
import { Navigate } from "react-router-dom";

// Steps list
const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Availability" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Amenities" },
  { id: 5, label: "Images" },
];

const INITIAL_PRICING_RULES = [
  {
    id: 1,
    dayType: "weekday",
    pricePerHour: "1500",
    minHours: "2",
    validFrom: "2026-06-01",
    validTo: "2026-12-31",
  },
  {
    id: 2,
    dayType: "weekend",
    pricePerHour: "2500",
    minHours: "4",
    validFrom: "2026-06-01",
    validTo: "2026-12-31",
  },
];

function OwnerAddVenue() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    type: "auditorium",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    capacity: "",
    latitude: null,
    longitude: null,
    lat: null,
    lng: null,
  });

  const [availability, setAvailability] = useState({
    openDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    openingTime: "08:00",
    closingTime: "22:00",
    minBookingHours: "2",
  });

  const [pricingRules, setPricingRules] = useState(INITIAL_PRICING_RULES);
  const [bookingType, setBookingType] = useState("hourly");
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);

  // Dynamic actions
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvailabilityChange = (field, value) => {
    setAvailability((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleDay = (day) => {
    const activeDays = availability.openDays.includes(day)
      ? availability.openDays.filter((d) => d !== day)
      : [...availability.openDays, day];
    handleAvailabilityChange("openDays", activeDays);
  };

  const addPricingRule = () => {
    const newId =
      pricingRules.length > 0
        ? Math.max(...pricingRules.map((r) => r.id)) + 1
        : 1;
    setPricingRules((prev) => [
      ...prev,
      {
        id: newId,
        dayType: "weekday",
        pricePerHour: "",
        minHours: "1",
        validFrom: "",
        validTo: "",
      },
    ]);
  };

  const updatePricingRule = (id, field, value) => {
    setPricingRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const deletePricingRule = (id) => {
    setPricingRules((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleAmenity = (id) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const setPrimaryImage = (id) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === id })),
    );
  };

  const deleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Drag and drop mock
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newImages = Array.from(e.dataTransfer.files).map((file, index) => ({
      id: Date.now() + index,
      file: file,
      previewUrl: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileInput = (e) => {
    const newImages = Array.from(e.target.files).map((file, index) => ({
      id: Date.now() + index,
      file,
      previewUrl: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };
  // Steps validations
  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      if (!basicInfo.name.trim()) stepErrors.name = "Venue name is required";
      if (!basicInfo.address.trim())
        stepErrors.address = "Street address is required";
      if (!basicInfo.city.trim()) stepErrors.city = "City is required";
      if (!basicInfo.state.trim()) stepErrors.state = "State is required";
      if (!basicInfo.pincode.trim()) stepErrors.pincode = "Pincode is required";
      if (!basicInfo.capacity) stepErrors.capacity = "Capacity is required";
    } else if (step === 2) {
      if (availability.openDays.length === 0)
        stepErrors.openDays = "At least one day must be selected";
      if (!availability.openingTime)
        stepErrors.openingTime = "Opening time is required";
      if (!availability.closingTime)
        stepErrors.closingTime = "Closing time is required";
    } else if (step === 3) {
      if (pricingRules.length === 0)
        stepErrors.rules = "At least one pricing rule is required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        alert("Venue Listing Form Submitted Successfully!");
        navigate("/owner/venues");
      }
    }
  };

  const [addVenue, { isLoading, isSuccess, error }] = useAddVenueMutation();

  const {
    data: amenitiesResponse,
    isLoading: amenitiesLoading,
    error: amenitiesError,
  } = useGetAmenitiesQuery();
  const amenitiesList = amenitiesResponse?.data ?? amenitiesResponse ?? [];

  const AMENITY_CATEGORIES = React.useMemo(() => {
    const groups = [];
    (amenitiesList || []).forEach((item) => {
      const existing = groups.find((g) => g.category === item.category);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({ category: item.category, items: [item] });
      }
    });
    return groups;
  }, [amenitiesList]);

  const handleSubmit = async () => {
    try {
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          const formData = new FormData();
          formData.append("file", img.file);
          formData.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          );

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            },
          );

          if (!res.ok) {
            throw new Error("Image upload failed. Please try again.");
          }

          const data = await res.json();

          if (!data.secure_url) {
            throw new Error(
              data.error?.message || "Image upload failed. Please try again.",
            );
          }

          return { url: data.secure_url, isPrimary: img.isPrimary };
        }),
      );

      const reqBody = {
        ...basicInfo,
        latitude: basicInfo.latitude ?? basicInfo.lat,
        longitude: basicInfo.longitude ?? basicInfo.lng,
        bookingType,
        openDays: availability.openDays,
        openTime: availability.openingTime,
        closeTime: availability.closingTime,
        minBookingHours: availability.minBookingHours,
        images: uploadedImages,
        pricing: pricingRules.map((pricing) => ({
          dayType: pricing.dayType,
          price: Number(pricing.pricePerHour),
          minHours: bookingType === "hourly" ? Number(pricing.minHours) : 1,
          validFrom: pricing.validFrom,
          validTo: pricing.validTo,
        })),
        venueAmenities: amenities,
      };

      await addVenue(reqBody).unwrap();
      toast.success("Venue created successfully.");
      navigate("/owner/venues");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Unable to submit venue. Please try again.",
      );
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleStepClick = (stepId) => {
    // allow clicking back to completed steps
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      setErrors({});
    } else if (stepId > currentStep) {
      // check if we can validate intermediate steps
      let canNavigate = true;
      for (let s = currentStep; s < stepId; s++) {
        if (!validateStep(s)) {
          canNavigate = false;
          setCurrentStep(s);
          break;
        }
      }
      if (canNavigate) {
        setCurrentStep(stepId);
        setErrors({});
      }
    }
  };

  const addCoordinates = (latitude, longitude) =>
    setBasicInfo((prev) => ({
      ...prev,
      latitude,
      longitude,
      lat: latitude,
      lng: longitude,
    }));

  const fileInputRef = useRef(null);

  return (
    <PageTransition className="wizard-page">
      <header className="wizard-page-header">
        <div className="wizard-page-header__text">
          <span className="eyebrow">List a venue</span>
          <h1 className="wizard-page-title">Add New Venue</h1>
          <p className="wizard-page-subtitle">
            Complete all steps to publish your venue on BookMyVenue
          </p>
        </div>
        <div className="wizard-step-counter">
          <span className="wizard-step-counter__label">Progress</span>
          <span className="wizard-step-counter__value">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
      </header>

      <div className="wizard-container">
        <div className="wizard-card">
          <div className="wizard-progress-bar">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`progress-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div className="step-number-badge">
                      {isCompleted ? (
                        <FiCheck className="step-check-icon" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="step-label">{step.label}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="progress-divider" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="wizard-card__body">
            {currentStep === 1 && (
              <div className="wizard-step-content">
                <div className="step-header">
                  <h2>Basic Venue Details</h2>
                  <p>
                    Define your venue classification, name, capacity limits, and
                    geographical settings.
                  </p>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="name">Venue Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={basicInfo.name}
                      onChange={handleBasicInfoChange}
                      placeholder="e.g. Skyline Rooftop Lounge"
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="type">Venue Type</label>
                    <select
                      id="type"
                      name="type"
                      value={basicInfo.type}
                      onChange={handleBasicInfoChange}
                    >
                      {/* Replace with api call  */}
                      <option value="auditorium">Auditorium</option>
                      <option value="studio">Studio</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="banquet">Banquet</option>
                      <option value="coworking">Coworking</option>
                      <option value="art_space">Art Space</option>
                      <option value="rooftop">Rooftop</option>
                      <option value="cafe">Cafe</option>
                    </select>
                  </div>
                </div>

                <div className="form-group-full">
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={basicInfo.description}
                      onChange={handleBasicInfoChange}
                      placeholder="Enter details about your venue atmosphere, suitable event types, and limitations..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="form-group-full">
                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <LocationPicker
                      address={basicInfo.address}
                      initialLatitude={basicInfo.latitude ?? basicInfo.lat}
                      initialLongitude={basicInfo.longitude ?? basicInfo.lng}
                      onLocationChange={addCoordinates}
                    />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={basicInfo.address}
                      onChange={handleBasicInfoChange}
                      placeholder="e.g. 123 Market Street, Suite 400"
                    />
                    {errors.address && (
                      <span className="error-message">{errors.address}</span>
                    )}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={basicInfo.city}
                      onChange={handleBasicInfoChange}
                      placeholder="e.g. San Francisco"
                    />
                    {errors.city && (
                      <span className="error-message">{errors.city}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={basicInfo.state}
                      onChange={handleBasicInfoChange}
                      placeholder="e.g. CA"
                    />
                    {errors.state && (
                      <span className="error-message">{errors.state}</span>
                    )}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="pincode">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={basicInfo.pincode}
                      onChange={handleBasicInfoChange}
                      placeholder="e.g. 94103"
                    />
                    {errors.pincode && (
                      <span className="error-message">{errors.pincode}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="capacity">Capacity</label>
                    <div className="input-group">
                      <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={basicInfo.capacity}
                        onChange={handleBasicInfoChange}
                        placeholder="e.g. 150"
                      />
                      <span className="input-suffix">people</span>
                    </div>
                    {errors.capacity && (
                      <span className="error-message">{errors.capacity}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AVAILABILTY */}
            {currentStep === 2 && (
              <div className="wizard-step-content">
                <div className="step-header">
                  <h2>Operations & Operating Hours</h2>
                  <p>
                    Configure which days your venue is open for booking and
                    specify the active slots.
                  </p>
                </div>

                <div className="form-group-full">
                  <span className="day-selector-label">Operating Days</span>
                  <div className="days-pills-row">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => {
                        const isActive = availability.openDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            className={`day-pill ${isActive ? "active" : ""}`}
                            onClick={() => toggleDay(day)}
                          >
                            {day}
                          </button>
                        );
                      },
                    )}
                  </div>
                  {errors.openDays && (
                    <span className="error-message">{errors.openDays}</span>
                  )}
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="openingTime">Opening Time</label>
                    <input
                      type="time"
                      id="openingTime"
                      value={availability.openingTime}
                      onChange={(e) =>
                        handleAvailabilityChange("openingTime", e.target.value)
                      }
                    />
                    {errors.openingTime && (
                      <span className="error-message">
                        {errors.openingTime}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="closingTime">Closing Time</label>
                    <input
                      type="time"
                      id="closingTime"
                      value={availability.closingTime}
                      onChange={(e) =>
                        handleAvailabilityChange("closingTime", e.target.value)
                      }
                    />
                    {errors.closingTime && (
                      <span className="error-message">
                        {errors.closingTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="minBookingHours">
                      Minimum Booking Hours
                    </label>
                    <input
                      type="number"
                      id="minBookingHours"
                      min="1"
                      max="24"
                      value={availability.minBookingHours}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          "minBookingHours",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/*PRICING */}
            {currentStep === 3 && (
              <div className="wizard-step-content">
                <div className="step-header">
                  <h2>Set Pricing Rules</h2>
                  <p>
                    {bookingType === "hourly"
                      ? "Customize hourly rates based on day types (Weekday/Weekend/Holiday) and specify validity ranges."
                      : "Set daily rates based on day types (Weekday/Weekend/Holiday) and specify validity ranges."}
                  </p>
                </div>

                <div className="booking-type-selector">
                  <label htmlFor="bookingType">Booking type</label>
                  <div className="booking-type-options">
                    <button
                      type="button"
                      className={`booking-type-option ${bookingType === "hourly" ? "active" : ""}`}
                      onClick={() => setBookingType("hourly")}
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      className={`booking-type-option ${bookingType === "daily" ? "active" : ""}`}
                      onClick={() => setBookingType("daily")}
                    >
                      Daily
                    </button>
                  </div>
                </div>

                <div className="pricing-section-header">
                  <h3>Pricing Rules</h3>
                  <button
                    type="button"
                    className="add-rule-btn"
                    onClick={addPricingRule}
                  >
                    <FiPlus /> Add Rule
                  </button>
                </div>

                {errors.rules && (
                  <p className="error-message" style={{ marginBottom: "16px" }}>
                    {errors.rules}
                  </p>
                )}

                <div className="pricing-rules-list">
                  {pricingRules.map((rule) => (
                    <div
                      key={rule.id}
                      className={`pricing-rule-card ${bookingType === "daily" ? "pricing-rule-card--daily" : ""}`}
                    >
                      <div className="rule-input-group">
                        <label>Day Type</label>
                        <select
                          value={rule.dayType}
                          onChange={(e) =>
                            updatePricingRule(
                              rule.id,
                              "dayType",
                              e.target.value,
                            )
                          }
                        >
                          <option value="weekday">Weekday</option>
                          <option value="weekend">Weekend</option>
                          <option value="holiday">Holiday</option>
                        </select>
                      </div>

                      <div className="rule-input-group">
                        <label>
                          {bookingType === "hourly" ? "Price Per Hour" : "Price Per Day"}
                        </label>
                        <div className="price-prefix-wrapper">
                          <span className="price-prefix">₹</span>
                          <input
                            type="number"
                            placeholder={bookingType === "hourly" ? "e.g. 1000" : "e.g. 5000"}
                            value={rule.pricePerHour}
                            onChange={(e) =>
                              updatePricingRule(
                                rule.id,
                                "pricePerHour",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>

                      {bookingType === "hourly" && (
                        <div className="rule-input-group">
                          <label>Min Hours</label>
                          <input
                            type="number"
                            placeholder="1"
                            value={rule.minHours}
                            onChange={(e) =>
                              updatePricingRule(
                                rule.id,
                                "minHours",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      )}

                      <div className="rule-input-group">
                        <label>Valid From</label>
                        <input
                          type="date"
                          value={rule.validFrom}
                          onChange={(e) =>
                            updatePricingRule(
                              rule.id,
                              "validFrom",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="rule-input-group">
                        <label>Valid To</label>
                        <input
                          type="date"
                          value={rule.validTo}
                          onChange={(e) =>
                            updatePricingRule(
                              rule.id,
                              "validTo",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="delete-btn-cell">
                        <button
                          type="button"
                          className="delete-rule-btn"
                          onClick={() => deletePricingRule(rule.id)}
                          aria-label="Delete rule"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: AMENITIES */}
            {currentStep === 4 && (
              <div className="wizard-step-content">
                <div className="step-header">
                  <h2>Select Amenities</h2>
                  <p>
                    Tick the amenities available at your venue. Grouped by
                    category.
                  </p>
                </div>

                {AMENITY_CATEGORIES.map((cat, i) => (
                  <div key={i} className="amenities-section">
                    <h3 className="amenity-category-title">{cat.category}</h3>
                    <div className="amenities-checkbox-grid">
                      {cat.items.map((item) => {
                        const isChecked = amenities.includes(item.id);
                        return (
                          <label
                            key={item.id}
                            className={`amenity-card-label ${isChecked ? "selected" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAmenity(item.id)}
                            />
                            <i className={`amenity-icon ti ${item.icon}`} />
                            <span className="amenity-label-text">
                              {item.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/*IMAGES */}
            {currentStep === 5 && (
              <div className="wizard-step-content">
                <div className="step-header">
                  <h2>Upload Photos</h2>
                  <p>
                    Upload venue images. Make sure to set a high-resolution
                    primary thumbnail.
                  </p>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  className="image-upload-zone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="upload-icon-wrapper">
                    <FiUpload />
                  </div>
                  <p className="upload-main-text">
                    Drag and drop your images here, or <span>browse files</span>
                  </p>
                  <p className="upload-sub-text">
                    Supports PNG, JPG or WEBP (Max 5MB)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileInput}
                  />
                </div>

                {/* Thumbnail Grid */}
                <div className="images-thumbnail-grid">
                  {images.map((img) => (
                    <div key={img.id} className="image-thumbnail-card">
                      <div className="thumbnail-image-wrapper">
                        <img src={img.previewUrl} alt="Venue preview" />
                      </div>

                      {img.isPrimary && (
                        <span className="primary-badge-overlay">Primary</span>
                      )}

                      <div className="thumbnail-controls">
                        <label className="primary-radio-label">
                          <input
                            type="radio"
                            name="primaryImage"
                            checked={img.isPrimary}
                            onChange={() => setPrimaryImage(img.id)}
                          />
                          Set Primary
                        </label>

                        <button
                          type="button"
                          className="delete-image-btn"
                          onClick={() => deleteImage(img.id)}
                          aria-label="Delete image"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* wizard-card__body */}
        </div>
        {/* wizard-card */}

        <footer className="wizard-bottom-bar">
          <div className="bottom-bar-inner">

            <div className="bottom-bar-right">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn-back"
                  onClick={handleBackStep}
                >
                  Back
                </button>
              )}

              <button
                type="button"
                className={currentStep === 5 ? "btn-submit" : "btn-next"}
                onClick={currentStep === 5 ? handleSubmit : handleNextStep}
              >
                {currentStep === 5 ? "Submit" : "Next Step"}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

export default OwnerAddVenue;
