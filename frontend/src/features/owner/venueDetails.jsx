import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiImage,
  FiCheckCircle,
  FiUpload,
  FiTrash2,
  FiPlus,
  FiLoader
} from 'react-icons/fi';
import {
  useGetVenueDetailsQuery,
  useGetAmenitiesQuery,
  useUpdateVenueMutation,
  useSubmitVenueMutation,
  useActivateVenueMutation,
  useDeactivateVenueMutation,
} from './ownerApi.js';
import PageTransition from '../../components/ui/PageTransition';
import LocationPicker from '../../components/map/LocationPicker.jsx';
import './venueDetails.scss';
import { toast, Toaster } from 'react-hot-toast';

const VENUE_TYPES = [
  { value: 'banquet_hall', label: 'Banquet Hall' },
  { value: 'meeting_room', label: 'Meeting Room' },
  { value: 'outdoor_space', label: 'Outdoor Space' },
  { value: 'studio', label: 'Studio' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'rooftop', label: 'Rooftop' },
];

const DAY_OPTIONS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

function OwnerVenueDetails() {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const { data: venueResponse, isLoading, error } = useGetVenueDetailsQuery(venueId);
  const { data: amenitiesResponse } = useGetAmenitiesQuery();
  const [updateVenue, { isLoading: isSaving }] = useUpdateVenueMutation();
  const [submitVenue, { isLoading: isSubmitSaving }] = useSubmitVenueMutation();
  const [activateVenue, { isLoading: isActivateSaving }] = useActivateVenueMutation();
  const [deactivateVenue, { isLoading: isDeactivateSaving }] = useDeactivateVenueMutation();
  const isToggleSaving = isActivateSaving || isDeactivateSaving;

  const venue = venueResponse?.data;
  const amenities = amenitiesResponse?.data ?? amenitiesResponse ?? [];

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    type: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    capacity: '',
    bookingType: 'daily',
    minBookingHours: '1',
    openTime: '09:00',
    closeTime: '18:00',
    openDays: [],
  });

  const [pricingRows, setPricingRows] = useState([
    { dayType: 'weekday', price: '', minHours: '1', validFrom: '', validTo: '' },
  ]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState(new Set());
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeStatus, setActiveStatus] = useState(!!venue?.isActive);
  // Keep local state in sync when venue data updates from the query
  useEffect(() => {
    setActiveStatus(!!venue?.isActive);
  }, [venue?.isActive]);

  const [dirty, setDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ success: '', error: '' });
  const [localSaving, setLocalSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!venue) return;

    const normalizedOpenDays = (Array.isArray(venue.openDays) ? venue.openDays : []).map(day => {
      const mapping = {
        'Mon': 'Monday',
        'Tue': 'Tuesday',
        'Wed': 'Wednesday',
        'Thu': 'Thursday',
        'Fri': 'Friday',
        'Sat': 'Saturday',
        'Sun': 'Sunday',
        'Monday': 'Monday',
        'Tuesday': 'Tuesday',
        'Wednesday': 'Wednesday',
        'Thursday': 'Thursday',
        'Friday': 'Friday',
        'Saturday': 'Saturday',
        'Sunday': 'Sunday'
      };
      return mapping[day] || day;
    });

    setFormState({
      name: venue.name || '',
      description: venue.description || '',
      type: venue.type || '',
      address: venue.address || '',
      city: venue.city || '',
      state: venue.state || '',
      pincode: venue.pincode || '',
      latitude: venue.latitude ?? '',
      longitude: venue.longitude ?? '',
      capacity: venue.capacity ?? '',
      bookingType: venue.bookingType || 'daily',
      minBookingHours: venue.minBookingHours?.toString() || '1',
      openTime: venue.openTime || '09:00',
      closeTime: venue.closeTime || '18:00',
      openDays: normalizedOpenDays,
    });
    setActiveImage(0);

    // Map existing images to complex image state
    const loadedImages = (venue.images || []).map((img, idx) => {
      const url = typeof img === 'string' ? img : (img.url || '');
      const isPrimary = typeof img === 'object' ? !!img.isPrimary : (idx === 0);
      return {
        id: `existing-${idx}-${url}`,
        file: null,
        previewUrl: url,
        isPrimary,
        isNew: false,
      };
    });
    setImages(loadedImages);

    setPricingRows(
      Array.isArray(venue.pricing) && venue.pricing.length > 0
        ? venue.pricing.map((row) => ({
          dayType: row.dayType || 'weekday',
          price: row.price?.toString() || '',
          minHours: row.minHours?.toString() || '1',
          validFrom: row.validFrom || '',
          validTo: row.validTo || '',
        }))
        : [{ dayType: 'weekday', price: '', minHours: '1', validFrom: '', validTo: '' }]
    );

    setSelectedAmenityIds(
      new Set(
        (venue.venueAmenities || [])
          .map((item) => item?.amenity?.id || item?.amenityId || item?.amenity_id)
          .filter(Boolean)
      )
    );
    setDirty(false);
    setStatusMessage({ success: '', error: '' });
  }, [venue]);

  const amenityCategories = useMemo(() => {
    return amenities.reduce((acc, amenity) => {
      const category = amenity.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(amenity);
      return acc;
    }, {});
  }, [amenities]);

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleLocationChange = (lat, lng) => {
    setFormState((prev) => {
      const prevLat = Number(prev.latitude);
      const prevLng = Number(prev.longitude);
      const nextLat = Number(lat);
      const nextLng = Number(lng);
      const hasChanged =
        Number.isNaN(prevLat) ||
        Number.isNaN(prevLng) ||
        Math.abs(prevLat - nextLat) > 0.000001 ||
        Math.abs(prevLng - nextLng) > 0.000001;

      if (hasChanged) {
        setDirty(true);
      }

      return { ...prev, latitude: lat, longitude: lng };
    });
  };

  const mapSearchAddress = [
    formState.address,
    formState.city,
    formState.state,
    formState.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  const handleDayToggle = (day) => {
    setFormState((prev) => {
      const nextDays = new Set(prev.openDays);
      if (nextDays.has(day)) {
        nextDays.delete(day);
      } else {
        nextDays.add(day);
      }
      setDirty(true);
      return { ...prev, openDays: Array.from(nextDays) };
    });
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenityIds((prev) => {
      const next = new Set(prev);
      if (next.has(amenityId)) {
        next.delete(amenityId);
      } else {
        next.add(amenityId);
      }
      setDirty(true);
      return next;
    });
  };

  // Image Drag and drop / Browsing handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addImagesFromFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    addImagesFromFiles(files);
  };

  const addImagesFromFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    setImages((prev) => {
      const hasPrimary = prev.some(img => img.isPrimary);
      const newImages = validFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        file,
        previewUrl: URL.createObjectURL(file),
        isPrimary: !hasPrimary && index === 0,
        isNew: true,
      }));
      setDirty(true);
      return [...prev, ...newImages];
    });
  };

  const setPrimaryImage = (id) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === id }))
    );
    setDirty(true);
  };

  const deleteImage = (id) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      // Fallback: If we deleted the primary image, make the first remaining image primary.
      if (prev.find(img => img.id === id)?.isPrimary && next.length > 0) {
        next[0].isPrimary = true;
      }
      setDirty(true);
      return next;
    });
  };

  const handlePricingChange = (index, field, value) => {
    setPricingRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      setDirty(true);
      return next;
    });
  };

  const addPricingRow = () => {
    setPricingRows((prev) => [...prev, { dayType: 'weekday', price: '', minHours: '1', validFrom: '', validTo: '' }]);
    setDirty(true);
  };

  const removePricingRow = (index) => {
    setPricingRows((prev) => prev.filter((_, idx) => idx !== index));
    setDirty(true);
  };

  const handleSave = async () => {
    setStatusMessage({ success: '', error: '' });
    setLocalSaving(true);

    try {
      // 1. Upload new files to Cloudinary sequentially or concurrently
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.isNew) {
            return { url: img.previewUrl, isPrimary: img.isPrimary };
          }

          const formData = new FormData();
          formData.append('file', img.file);
          formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!res.ok) {
            throw new Error('Image upload failed. Please try again.');
          }

          const data = await res.json();
          return { url: data.secure_url, isPrimary: img.isPrimary };
        })
      );

      // 2. Prepare request body payload
      const payload = {
        ...formState,
        capacity: Number(formState.capacity) || 0,
        minBookingHours: Number(formState.minBookingHours) || 1,
        latitude: formState.latitude !== '' ? Number(formState.latitude) : null,
        longitude: formState.longitude !== '' ? Number(formState.longitude) : null,
        images: uploadedImages,
        openDays: formState.openDays,
        pricing: pricingRows.map((row) => ({
          dayType: row.dayType,
          price: Number(row.price) || 0,
          minHours: Number(row.minHours) || 1,
          validFrom: row.validFrom || null,
          validTo: row.validTo || null,
        })),
        venueAmenities: Array.from(selectedAmenityIds),
      };

      // 3. Trigger endpoint query
      await updateVenue({ venueId, payload }).unwrap();
      setStatusMessage({ success: 'Venue details updated successfully.', error: '' });
      setDirty(false);

      // Reset the local state to match the saved state
      const refreshedImages = uploadedImages.map((img, idx) => ({
        id: `existing-${idx}-${img.url}`,
        file: null,
        previewUrl: img.url,
        isPrimary: img.isPrimary,
        isNew: false,
      }));
      setImages(refreshedImages);

    } catch (err) {
      console.error(err);
      setStatusMessage({
        success: '',
        error:
          err?.data?.message || err?.message || 'Unable to update venue details. Please try again.',
      });
    } finally {
      setLocalSaving(false);
    }
  };


  const handleToggleActive = async () => {
    setStatusMessage({ success: '', error: '' });
    const previousStatus = activeStatus;
    const newStatus = !previousStatus;
    // Optimistically update UI
    setActiveStatus(newStatus);
    try {
      if (newStatus) {
        await activateVenue(venueId).unwrap();
        setStatusMessage({ success: 'Venue activated successfully.', error: '' });
      } else {
        await deactivateVenue(venueId).unwrap();
        setStatusMessage({ success: 'Venue deactivated successfully.', error: '' });
      }
    } catch (err) {
      console.error(err);
      // Revert UI on failure
      setActiveStatus(previousStatus);
      setStatusMessage({
        success: '',
        error: err?.data?.message || err?.message || 'Failed to update listing status.',
      });
    }
  };
  // Determine if all required fields are filled before allowing submission
  // Submit venue for review
  const handleSubmitForReview = async () => {
    setStatusMessage({ success: '', error: '' });
    try {
      await submitVenue(venueId).unwrap();
      toast.success('Venue submitted for review successfully.');
    } catch (err) {
      console.error(err);
      const msg = err?.data?.message || err?.message || 'Failed to submit for review.';
      toast.error(msg);
      setStatusMessage({ success: '', error: msg });
    }
  };
  const isFormComplete = React.useMemo(() => {
    const {
      name,
      description,
      type,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      capacity,
      bookingType,
      openTime,
      closeTime,
      openDays,
    } = formState;
    const requiredFilled =
      name &&
      type &&
      address &&
      city &&
      state &&
      pincode &&
      capacity &&
      bookingType &&
      openTime &&
      closeTime;
    const daysSelected = Array.isArray(openDays) && openDays.length > 0;
    return requiredFilled && daysSelected;
  }, [formState]);

  if (isLoading) {
    return (
      <PageTransition className="owner-venue-details-page">
        <div className="venue-details-loading">
          <FiLoader className="spinner" style={{ animation: 'spin 1s linear infinite', fontSize: '24px', marginBottom: '12px' }} />
          <div>Loading venue details…</div>
        </div>
      </PageTransition>
    );
  }


  if (error) {
    return (
      <PageTransition className="owner-venue-details-page">
        <div className="venue-details-error">
          <h2>Unable to load venue details</h2>
          <p>{error?.data?.message || 'Please refresh or try again later.'}</p>
          <button className="secondary-btn" onClick={() => navigate('/owner/venues')}>
            Back to Venues
          </button>
        </div>
      </PageTransition>
    );
  }

  const statusLabel = STATUS_LABELS[venue?.approvalStatus] || venue?.approvalStatus || 'Unknown';
  const venueLocation = [venue?.city, venue?.state].filter(Boolean).join(', ');

  // Choose preview image based on activeImage previewUrl
  const imageUrls = images.map((img) => img.previewUrl);
  const primaryImage = imageUrls[activeImage] || imageUrls[0] || '/placeholder.jpg';
  const isSavingPending = localSaving || isSaving;

  return (
    <PageTransition className="owner-venue-details-page">
      <Toaster position="top-right" />
      <div className="venue-details-topbar">
        <button className="back-link" onClick={() => navigate('/owner/venues')}>
          <FiArrowLeft /> Back to venues
        </button>
        <div className="venue-details-title-block">
          <p className="eyebrow">Venue management</p>
          <h1>{formState.name || 'Venue details'}</h1>
          <p className="venue-details-subtitle">Update your venue information, pricing, availability and presentation in one place.</p>
        </div>
        <div className="venue-details-actions">
          {venue?.approvalStatus === 'draft' && (
            <button
              className="primary-btn submit-for-review-btn"
              disabled={!isFormComplete || isSubmitSaving}
              onClick={handleSubmitForReview}
            >
              {isSubmitSaving ? (
                <>
                  <FiLoader className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  Submitting…
                </>
              ) : (
                'Submit for review'
              )}
            </button>
          )}
          <button className="secondary-btn" disabled={isSavingPending || isSubmitSaving} onClick={() => navigate('/owner/venues')}>
            Cancel
          </button>
          <button className="primary-btn" disabled={!dirty || isSavingPending || isSubmitSaving} onClick={handleSave}>
            {isSavingPending ? (
              <>
                <FiLoader className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                Saving changes…
              </>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </div>

      <div className="venue-details-grid">
        <aside className="venue-summary-panel">
          <div className="venue-summary-card">
            <div className="venue-summary-image">
              <img src={primaryImage} alt={formState.name || 'Venue preview'} />
            </div>
            {images.length > 1 && (
              <div className="venue-image-thumbs">
                {images.map((img, index) => (
                  <button
                    key={`thumb-${img.id}`}
                    type="button"
                    className={`venue-thumb ${index === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img.previewUrl} alt={`Thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
            <div className="venue-summary-body">
              <div className="summary-title-row">
                <div>
                  <h2>{formState.name || 'Untitled venue'}</h2>
                  <p>{venueLocation || 'Location not available'}</p>
                </div>
                <span className={`status-pill status-pill--${venue?.approvalStatus || 'draft'}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="summary-meta-list">
                <div>
                  <span>Category</span>
                  <strong>{VENUE_TYPES.find((item) => item.value === formState.type)?.label || 'Not specified'}</strong>
                </div>
                <div>
                  <span>Capacity</span>
                  <strong>{formState.capacity || '—'} guests</strong>
                </div>
                <div>
                  <span>Booking</span>
                  <strong>{formState.bookingType === 'hourly' ? 'Hourly' : 'Daily'}</strong>
                </div>
                <div>
                  <span>Open hours</span>
                  <strong>{`${formState.openTime} – ${formState.closeTime}`}</strong>
                </div>
              </div>
              <div className={`venue-summary-status ${!activeStatus ? 'inactive' : ''}`}>
                <FiCheckCircle /> <span>{activeStatus ? 'Active listing' : 'Inactive listing'}</span>
              </div>
            </div>
          </div>

          <div className="venue-summary-card">
            <div className="venue-summary-body compact">
              <div className="summary-meta-list compact">
                <div>
                  <span>Approval status</span>
                  <strong>{statusLabel}</strong>
                </div>
                <div>
                  <span>Last updated</span>
                  <strong>{venue?.updatedAt ? new Date(venue.updatedAt).toLocaleDateString() : '—'}</strong>
                </div>
              </div>
              <div className="toggle-container" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(229, 231, 235, 0.6)' }}>
                <div className="toggle-text">
                  <h3>Active Listing</h3>
                  <p>{activeStatus ? 'Visible to public' : 'Hidden from public'}</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={activeStatus}
                    disabled={isToggleSaving}
                    onChange={handleToggleActive}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="venue-edit-card">
          <section className="detail-section">
            <div className="section-heading">
              <div>
                <h2>Venue details</h2>
                <p>Edit the most important venue attributes first.</p>
              </div>
              <span className="section-pill">Business profile</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Venue name</label>
                <input id="name" value={formState.name} onChange={(e) => handleInputChange('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="type">Venue type</label>
                <select id="type" value={formState.type} onChange={(e) => handleInputChange('type', e.target.value)}>
                  <option value="">Select type</option>
                  {VENUE_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group form-group-full">
                <label htmlFor="description">Description</label>
                <textarea id="description" rows="4" value={formState.description} onChange={(e) => handleInputChange('description', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Guest capacity</label>
                <input id="capacity" type="number" min="1" value={formState.capacity} onChange={(e) => handleInputChange('capacity', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="bookingType">Booking model</label>
                <select id="bookingType" value={formState.bookingType} onChange={(e) => handleInputChange('bookingType', e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <div className="section-heading">
              <div>
                <h2>Location & availability</h2>
                <p>Keep address, schedule, and access details accurate.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width location-map-block">
                <label htmlFor="address">Street address</label>
                <p className="field-hint">
                  Type an address to move the pin automatically, or click the map to set the exact location.
                </p>
                <div className="location-map-wrapper">
                  <LocationPicker
                    address={mapSearchAddress}
                    initialLatitude={formState.latitude}
                    initialLongitude={formState.longitude}
                    onLocationChange={handleLocationChange}
                  />
                </div>
                <input
                  id="address"
                  value={formState.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g. 123 Market Street, Suite 400"
                />
                {(formState.latitude !== '' && formState.longitude !== '') && (
                  <p className="location-coords">
                    Coordinates: {Number(formState.latitude).toFixed(6)}, {Number(formState.longitude).toFixed(6)}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input id="city" value={formState.city} onChange={(e) => handleInputChange('city', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input id="state" value={formState.state} onChange={(e) => handleInputChange('state', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input id="pincode" value={formState.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Open days</label>
                <div className="checkbox-grid">
                  {DAY_OPTIONS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`checkbox-pill ${formState.openDays.includes(day) ? 'active' : ''}`}
                      onClick={() => handleDayToggle(day)}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="openTime">Open time</label>
                <input id="openTime" type="time" value={formState.openTime} onChange={(e) => handleInputChange('openTime', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="closeTime">Close time</label>
                <input id="closeTime" type="time" value={formState.closeTime} onChange={(e) => handleInputChange('closeTime', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="minBookingHours">Min booking hours</label>
                <input id="minBookingHours" type="number" min="1" value={formState.minBookingHours} onChange={(e) => handleInputChange('minBookingHours', e.target.value)} />
              </div>
            </div>
          </section>

          <section className="detail-section">
            <div className="section-heading">
              <div>
                <h2>Media & pricing</h2>
                <p>Keep imagery sharp and pricing transparent for guests.</p>
              </div>
            </div>

            <div className="image-editor">
              <div className="image-editor-header">
                <div>
                  <h3>Venue images</h3>
                  <p>Drag and drop your images here or upload directly. Remember to select one as the primary thumbnail.</p>
                </div>
              </div>

              {/* Interactive Drag & Drop upload zone */}
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
                  Supports PNG, JPG, JPEG or WEBP (Max 5MB)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileInput}
                />
              </div>

              {/* Custom interactive thumbnail list with status badges and deletion capabilities */}
              {images.length > 0 && (
                <div className="images-thumbnail-grid">
                  {images.map((img) => (
                    <div key={img.id} className="image-thumbnail-card">
                      <div className="thumbnail-image-wrapper">
                        <img src={img.previewUrl} alt="Venue preview" />
                        {img.isNew && isSavingPending && (
                          <div className="upload-overlay">
                            <div className="spinner" />
                            <span>Uploading…</span>
                          </div>
                        )}
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
              )}
            </div>

            <div className="pricing-table" style={{ marginTop: '28px' }}>
              <div className="pricing-table-heading">
                <div>
                  <h3>Pricing structure</h3>
                  <p>Configure rates depending on weekdays, weekends, or special events.</p>
                </div>
                <button type="button" className="ghost-btn" onClick={addPricingRow}>
                  <FiPlus /> Add pricing row
                </button>
              </div>
              <div className="pricing-table-grid">
                {pricingRows.map((row, index) => (
                  <div className="pricing-row" key={`pricing-${index}`}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <select value={row.dayType} onChange={(e) => handlePricingChange(index, 'dayType', e.target.value)}>
                        <option value="weekday">Weekday</option>
                        <option value="weekend">Weekend</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <input type="number" min="0" placeholder="Price (₹/hour)" value={row.price} onChange={(e) => handlePricingChange(index, 'price', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <input type="number" min="1" placeholder="Min hours" value={row.minHours} onChange={(e) => handlePricingChange(index, 'minHours', e.target.value)} />
                    </div>
                    <button type="button" className="secondary-btn small" onClick={() => removePricingRow(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-section">
            <div className="section-heading">
              <div>
                <h2>Amenities</h2>
                <p>Manage the features available to guests for this venue.</p>
              </div>
            </div>
            <div className="amenity-categories">
              {Object.entries(amenityCategories).map(([category, items]) => (
                <div key={category} className="amenity-category">
                  <h4>{category}</h4>
                  <div className="amenities-grid">
                    {items.map((amenity) => (
                      <button
                        key={amenity.id}
                        type="button"
                        className={`amenity-pill ${selectedAmenityIds.has(amenity.id) ? 'active' : ''}`}
                        onClick={() => handleAmenityToggle(amenity.id)}
                      >
                        {amenity.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

  export default OwnerVenueDetails;
