import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiTrash2, FiPlus, FiUpload } from 'react-icons/fi';
import './addVenue.scss';
import {useAddVenueMutation} from "./ownerApi.js"

// Steps list
const STEPS = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Availability' },
  { id: 3, label: 'Pricing' },
  { id: 4, label: 'Amenities' },
  { id: 5, label: 'Images' }
];

// Mock amenities data — will be replaced by API call later
export const amenitiesData = [
  // connectivity
  { name: 'Wi-Fi',               slug: 'wifi',           icon: 'ti ti-wifi',                 category: 'connectivity' },
  // facilities
  { name: 'Parking',             slug: 'parking',        icon: 'ti ti-car',                  category: 'facilities' },
  { name: 'AC',                  slug: 'ac',             icon: 'ti ti-snowflake',            category: 'facilities' },
  { name: 'Kitchen',             slug: 'kitchen',        icon: 'ti ti-tools-kitchen-2',      category: 'facilities' },
  { name: 'Wheelchair Accessible', slug: 'wheelchair',   icon: 'ti ti-wheelchair',           category: 'facilities' },
  { name: 'Security',            slug: 'security',       icon: 'ti ti-shield',               category: 'facilities' },
  { name: 'Outdoor Seating',     slug: 'outdoor_seating', icon: 'ti ti-armchair',            category: 'facilities' },
  // equipment
  { name: 'Projector',           slug: 'projector',      icon: 'ti ti-device-projector',     category: 'equipment' },
  { name: 'AV Equipment',        slug: 'av_equipment',   icon: 'ti ti-speakerphone',         category: 'equipment' },
  { name: 'Whiteboard',          slug: 'whiteboard',     icon: 'ti ti-writing',              category: 'equipment' },
  { name: 'Stage',               slug: 'stage',          icon: 'ti ti-device-tv',            category: 'equipment' },
  { name: 'Green Room',          slug: 'green_room',     icon: 'ti ti-door',                 category: 'equipment' },
  // ambience
  { name: 'Natural Light',       slug: 'natural_light',  icon: 'ti ti-sun',                  category: 'ambience' },
  { name: 'Catering',            slug: 'catering',       icon: 'ti ti-salad',                category: 'ambience' },
];

// Group amenitiesData by category for rendering
const AMENITY_CATEGORIES = amenitiesData.reduce((groups, item) => {
  const existing = groups.find(g => g.category === item.category);
  if (existing) {
    existing.items.push(item);
  } else {
    groups.push({ category: item.category, items: [item] });
  }
  return groups;
}, []);

const INITIAL_PRICING_RULES = [
  { id: 1, dayType: 'Weekday', pricePerHour: '1500', minHours: '2', validFrom: '2026-06-01', validTo: '2026-12-31' },
  { id: 2, dayType: 'Weekend', pricePerHour: '2500', minHours: '4', validFrom: '2026-06-01', validTo: '2026-12-31' }
];

const INITIAL_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&h=400&q=80', isPrimary: true },
  { id: 2, url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&h=400&q=80', isPrimary: false },
  { id: 3, url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&h=400&q=80', isPrimary: false }
];

function OwnerAddVenue() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    type: 'Hall',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    capacity: ''
  });

  const [availability, setAvailability] = useState({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    openingTime: '08:00',
    closingTime: '22:00',
    minBookingHours: '2'
  });

  const [pricingRules, setPricingRules] = useState(INITIAL_PRICING_RULES);
  const [amenities, setAmenities] = useState(['wifi', 'ac', 'parking']); // selected slugs
  const [images, setImages] = useState(INITIAL_IMAGES);

  // Dynamic actions
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvailabilityChange = (field, value) => {
    setAvailability(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleDay = (day) => {
    const activeDays = availability.days.includes(day)
      ? availability.days.filter(d => d !== day)
      : [...availability.days, day];
    handleAvailabilityChange('days', activeDays);
  };

  const addPricingRule = () => {
    const newId = pricingRules.length > 0 ? Math.max(...pricingRules.map(r => r.id)) + 1 : 1;
    setPricingRules(prev => [...prev, {
      id: newId,
      dayType: 'Weekday',
      pricePerHour: '',
      minHours: '1',
      validFrom: '',
      validTo: ''
    }]);
  };

  const updatePricingRule = (id, field, value) => {
    setPricingRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const deletePricingRule = (id) => {
    setPricingRules(prev => prev.filter(r => r.id !== id));
  };

  const toggleAmenity = (id) => {
    setAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const setPrimaryImage = (id) => {
    setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  const deleteImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Drag and drop mock
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // mock adding an image
    const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
    setImages(prev => [...prev, {
      id: newId,
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&h=400&q=80',
      isPrimary: prev.length === 0
    }]);
  };

  // Steps validations
  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      if (!basicInfo.name.trim()) stepErrors.name = 'Venue name is required';
      if (!basicInfo.address.trim()) stepErrors.address = 'Street address is required';
      if (!basicInfo.city.trim()) stepErrors.city = 'City is required';
      if (!basicInfo.state.trim()) stepErrors.state = 'State is required';
      if (!basicInfo.pincode.trim()) stepErrors.pincode = 'Pincode is required';
      if (!basicInfo.capacity) stepErrors.capacity = 'Capacity is required';
    } else if (step === 2) {
      if (availability.days.length === 0) stepErrors.days = 'At least one day must be selected';
      if (!availability.openingTime) stepErrors.openingTime = 'Opening time is required';
      if (!availability.closingTime) stepErrors.closingTime = 'Closing time is required';
    } else if (step === 3) {
      if (pricingRules.length === 0) stepErrors.rules = 'At least one pricing rule is required';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        alert('Venue Listing Form Submitted Successfully!');
        navigate('/owner/venues');
      }
    }
  };

  const [addVenue, { isLoading, isSuccess, error }] =
    useAddVenueMutation();

  const handleSubmit = async() => {
    const reqBody = {
      ...basicInfo,
      openDays: availability.days,
      openTime: availability.openingTime,
      closeTime: availability.closingTime,
      minBookingHours: availability.minBookingHours,
      images: images.map(img =>( {url: img.url, isPrimary: img.isPrimary})),
      pricing: pricingRules.map(pricing => ({dayType: pricing.dayType, pricePerHour:pricing.pricePerHour, minHours: pricing.minHours, validFrom: pricing.validFrom, validTo: pricing.validTo})),
      amenitities: []  // add later
    }

    try{
        const result =  await addVenue(reqBody).unwrap();
    }
    catch(err){
      console.log(err)
    }


  }

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

  return (
    <div className="wizard-container">
      <div className="wizard-progress-bar">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div 
                className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="step-number-badge">
                  {isCompleted ? <FiCheck className="step-check-icon" /> : step.id}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
              {index < STEPS.length - 1 && <div className="progress-divider" />}
            </React.Fragment>
          );
        })}
      </div>

       {/* BASIC INFO */}
      {currentStep === 1 && (
        <div className="wizard-step-content">
          <div className="step-header">
            <h2>Basic Venue Details</h2>
            <p>Define your venue classification, name, capacity limits, and geographical settings.</p>
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
              {errors.name && <span className="error-message">{errors.name}</span>}
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
                <option value="Hall">Hall</option>
                <option value="Rooftop">Rooftop</option>
                <option value="Banquet">Banquet</option>
                <option value="Conference Room">Conference Room</option>
                <option value="Farmhouse">Farmhouse</option>
                <option value="Studio">Studio</option>
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
              <input
                type="text"
                id="address"
                name="address"
                value={basicInfo.address}
                onChange={handleBasicInfoChange}
                placeholder="e.g. 123 Market Street, Suite 400"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
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
              {errors.city && <span className="error-message">{errors.city}</span>}
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
              {errors.state && <span className="error-message">{errors.state}</span>}
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
              {errors.pincode && <span className="error-message">{errors.pincode}</span>}
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
              {errors.capacity && <span className="error-message">{errors.capacity}</span>}
            </div>
          </div>
        </div>
      )}

      {/* AVAILABILTY */}
      {currentStep === 2 && (
        <div className="wizard-step-content">
          <div className="step-header">
            <h2>Operations & Operating Hours</h2>
            <p>Configure which days your venue is open for booking and specify the active slots.</p>
          </div>

          <div className="form-group-full">
            <span className="day-selector-label">Operating Days</span>
            <div className="days-pills-row">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                const isActive = availability.days.includes(day);
                return (
                  <button 
                    key={day}
                    type="button" 
                    className={`day-pill ${isActive ? 'active' : ''}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {errors.days && <span className="error-message">{errors.days}</span>}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="openingTime">Opening Time</label>
              <input 
                type="time" 
                id="openingTime" 
                value={availability.openingTime} 
                onChange={(e) => handleAvailabilityChange('openingTime', e.target.value)} 
              />
              {errors.openingTime && <span className="error-message">{errors.openingTime}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="closingTime">Closing Time</label>
              <input 
                type="time" 
                id="closingTime" 
                value={availability.closingTime} 
                onChange={(e) => handleAvailabilityChange('closingTime', e.target.value)} 
              />
              {errors.closingTime && <span className="error-message">{errors.closingTime}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="minBookingHours">Minimum Booking Hours</label>
              <input 
                type="number" 
                id="minBookingHours" 
                min="1"
                max="24"
                value={availability.minBookingHours} 
                onChange={(e) => handleAvailabilityChange('minBookingHours', e.target.value)} 
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
            <p>Customize hourly rates based on day types (Weekday/Weekend/Holiday) and specify validity ranges.</p>
          </div>

          <div className="pricing-section-header">
            <h3>Pricing Rules</h3>
            <button type="button" className="add-rule-btn" onClick={addPricingRule}>
              <FiPlus /> Add Rule
            </button>
          </div>

          {errors.rules && <p className="error-message" style={{marginBottom: '16px'}}>{errors.rules}</p>}

          <div className="pricing-rules-list">
            {pricingRules.map((rule) => (
              <div key={rule.id} className="pricing-rule-card">
                <div className="rule-input-group">
                  <label>Day Type</label>
                  <select 
                    value={rule.dayType} 
                    onChange={(e) => updatePricingRule(rule.id, 'dayType', e.target.value)}
                  >
                    <option value="Weekday">Weekday</option>
                    <option value="Weekend">Weekend</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>

                <div className="rule-input-group">
                  <label>Price Per Hour</label>
                  <div className="price-prefix-wrapper">
                    <span className="price-prefix">₹</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 1000" 
                      value={rule.pricePerHour}
                      onChange={(e) => updatePricingRule(rule.id, 'pricePerHour', e.target.value)}
                    />
                  </div>
                </div>

                <div className="rule-input-group">
                  <label>Min Hours</label>
                  <input 
                    type="number" 
                    placeholder="1" 
                    value={rule.minHours}
                    onChange={(e) => updatePricingRule(rule.id, 'minHours', e.target.value)}
                  />
                </div>

                <div className="rule-input-group">
                  <label>Valid From</label>
                  <input 
                    type="date" 
                    value={rule.validFrom}
                    onChange={(e) => updatePricingRule(rule.id, 'validFrom', e.target.value)}
                  />
                </div>

                <div className="rule-input-group">
                  <label>Valid To</label>
                  <input 
                    type="date" 
                    value={rule.validTo}
                    onChange={(e) => updatePricingRule(rule.id, 'validTo', e.target.value)}
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
            <p>Tick the amenities available at your venue. Grouped by category.</p>
          </div>

          {AMENITY_CATEGORIES.map((cat, i) => (
            <div key={i} className="amenities-section">
              <h3 className="amenity-category-title">{cat.category}</h3>
              <div className="amenities-checkbox-grid">
                {cat.items.map((item) => {
                  const isChecked = amenities.includes(item.slug);
                  return (
                    <label
                      key={item.slug}
                      className={`amenity-card-label ${isChecked ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenity(item.slug)}
                      />
                      <i className={`amenity-icon ${item.icon}`} />
                      <span className="amenity-label-text">{item.name}</span>
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
            <p>Upload venue images. Make sure to set a high-resolution primary thumbnail.</p>
          </div>

          {/* Drag and Drop Zone */}
          <div 
            className="image-upload-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="upload-icon-wrapper">
              <FiUpload />
            </div>
            <p className="upload-main-text">
              Drag and drop your images here, or <span>browse files</span>
            </p>
            <p className="upload-sub-text">Supports PNG, JPG or WEBP (Max 5MB)</p>
          </div>

          {/* Thumbnail Grid */}
          <div className="images-thumbnail-grid">
            {images.map((img) => (
              <div key={img.id} className="image-thumbnail-card">
                <div className="thumbnail-image-wrapper">
                  <img src={img.url} alt="Venue preview" />
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

      <footer className="wizard-bottom-bar">
        <div className="bottom-bar-inner">
          <button 
            type="button" 
            className="btn-save-draft"
            onClick={() => {
              alert('Venue saved as draft.');
              navigate('/owner/venues');
            }}
          >
            Save as Draft
          </button>

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
              className={currentStep === 5 ? 'btn-submit' : 'btn-next'}
              onClick={ currentStep === 5 ? handleSubmit : handleNextStep}
            >
              {currentStep === 5 ? 'Submit' : 'Next Step'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default OwnerAddVenue;
