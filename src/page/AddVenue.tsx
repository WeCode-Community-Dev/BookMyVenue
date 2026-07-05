import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Check, ShieldAlert,
  Calendar, Star, Sparkles, Building, Settings,
  PlusCircle, Trash2, BadgeAlert
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LocationPicker } from '@/components/map';
import { addVenue } from '../data/venuesData';
import type { Venue } from '../data/venuesData';


const PRESET_AMENITIES = [
  'High-speed Wi-Fi',
  'Professional Sound System',
  'Bridal Suite',
  'Full AC & Heating',
  'Ambient LED Lighting',
  'Outdoor Garden Area',
  'Stage & Podium'
];

const PRESET_EVENT_TYPES = [
  'Weddings',
  'Corporate Galas',
  'Cocktail Receptions',
  'Art Exhibitions'
];

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
];

/**
 * AddVenue Component
 * Renders an interactive form for hosts to create and publish a new venue listing.
 * Includes local state management for inline template preview and file upload handling.
 */
export default function AddVenue() {
  const navigate = useNavigate();
  
  // Form Input States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(''); // Town / city name
  const [fullAddress, setFullAddress] = useState(''); // Full location
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<number>(0);
  const [squareFeet, setSquareFeet] = useState<number>(0);
  const [pricePerNight, setPricePerNight] = useState<number>(0);
  const [hostType, setHostType] = useState('Superhost');
  const [isTopRated, setIsTopRated] = useState(true);
  const [bookingType, setBookingType] = useState<'days' | 'hours'>('days');
  const [cleaningGap, setCleaningGap] = useState<number>(0);
  const [openingTime, setOpeningTime] = useState<string>('08:00');
  const [closingTime, setClosingTime] = useState<string>('22:00');

  // Lists/Arrays
  const [imageUrls, setImageUrls] = useState<string[]>([
    MOCK_IMAGES[0],
    MOCK_IMAGES[1],
    MOCK_IMAGES[2]
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(PRESET_AMENITIES);
  const [customAmenity, setCustomAmenity] = useState('');

  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(PRESET_EVENT_TYPES);
  const [customEventType, setCustomEventType] = useState('');

  const [catering, setCatering] = useState('In-house gourmet catering available (fully custom menu arrangements), outside licensed & insured caterers allowed upon approval.');
  const [parking, setParking] = useState('Valet parking available for up to 80 cars, underground secure parking garage with 120 dedicated slots, and multiple active EV charging stations.');

  const [rules, setRules] = useState<string[]>([
    'Music must transition to indoor after 11 PM',
    'No confetti, glitter, or open flames permitted',
    'Licensed and certified bartenders required for any alcohol service'
  ]);
  const [newRule, setNewRule] = useState('');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const availableEventTypes = Array.from(new Set([...PRESET_EVENT_TYPES, ...selectedEventTypes]));
  const availableAmenities = Array.from(new Set([...PRESET_AMENITIES, ...selectedAmenities]));

  // Pricing calculations
  const basePrice = pricePerNight || 0;
  const serviceFee = Math.round(basePrice * 0.15);
  const totalPrice = basePrice + serviceFee;

  // Add / remove images
  const handleAddImage = () => {
    if (!customImageUrl.trim()) return;
    if (!imageUrls.includes(customImageUrl.trim())) {
      setImageUrls([...imageUrls, customImageUrl.trim()]);
    }
    setCustomImageUrl('');
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const handleRemoveImage = (index: number) => {
    const updated = imageUrls.filter((_, idx) => idx !== index);
    setImageUrls(updated);
    if (activeImageIdx >= updated.length) {
      setActiveImageIdx(Math.max(0, updated.length - 1));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          setImageUrls([...imageUrls, data.imageUrl]);
          setErrors(prev => ({ ...prev, images: '' }));
        }
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, images: errorData.message || 'Failed to upload image.' }));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setErrors(prev => ({ ...prev, images: 'Error uploading image.' }));
    } finally {
      setIsUploading(false);
    }
  };

  // Amenities helpers
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (!customAmenity.trim()) return;
    if (!selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()]);
    }
    setCustomAmenity('');
  };

  // Event types helpers
  const toggleEventType = (type: string) => {
    if (selectedEventTypes.includes(type)) {
      setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
    } else {
      setSelectedEventTypes([...selectedEventTypes, type]);
    }
  };

  const handleAddCustomEventType = () => {
    if (!customEventType.trim()) return;
    if (!selectedEventTypes.includes(customEventType.trim())) {
      setSelectedEventTypes([...selectedEventTypes, customEventType.trim()]);
    }
    setCustomEventType('');
  };

  // House rules helpers
  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, newRule.trim()]);
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, idx) => idx !== index));
  };

  // Validation
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!title.trim()) tempErrors.title = 'Title is required.';
    if (!description.trim()) tempErrors.description = 'Description is required.';
    if (!fullAddress.trim()) tempErrors.fullAddress = 'Full Location / Street Address is required.';
    if (!location.trim()) tempErrors.location = 'Town Name is required.';
    if (capacity <= 0) tempErrors.capacity = 'Capacity must be greater than zero.';
    if (squareFeet <= 0) tempErrors.squareFeet = 'Space Area must be greater than zero.';
    if (pricePerNight <= 0) tempErrors.pricePerNight = 'Daily Rate must be greater than zero.';
    if (imageUrls.length < 3) tempErrors.images = 'A minimum of three images is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const generatedId = Date.now().toString();

    const tags = [
      location,
      `${capacity} Guests`,
      isTopRated ? 'Luxury' : 'Handpicked'
    ];

    const newVenue: Venue = {
      id: generatedId,
      images: imageUrls,
      tags,
      location,
      capacity,
      rating: 4.9,
      title,
      dateRange: 'Available',
      hostType,
      isTopRated,
      description,
      pricePerNight,
      fullAddress,
      latitude,
      longitude,
      parking,
      amenities: selectedAmenities,
      squareFeet,
      catering,
      rules,
      eventTypes: selectedEventTypes,
      bookingType,
      cleaningGap,
      openingTime,
      closingTime
    };

    const token = localStorage.getItem('token');
    let savedId = generatedId;
    
    if (token) {
      try {
        const response = await fetch('http://localhost:5000/api/venues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title,
            description,
            location,
            full_address: fullAddress,
            latitude,
            longitude,
            capacity: Number(capacity),
            square_feet: Number(squareFeet),
            price_per_night: Number(pricePerNight),
            host_type: hostType,
            rating: 4.9,
            is_top_rated: isTopRated,
            date_range: 'Available',
            parking,
            catering,
            images: imageUrls,
            amenities: selectedAmenities,
            rules,
            event_types: selectedEventTypes,
            booking_type: bookingType,
            cleaning_gap: Number(cleaningGap),
            opening_time: openingTime,
            closing_time: closingTime
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.venue && data.venue.id) {
            savedId = data.venue.id.toString();
          }
        } else {
          // Fallback to local storage
          addVenue(newVenue);
        }
      } catch (err) {
        console.error('Failed submitting venue listing to backend, falling back:', err);
        addVenue(newVenue);
      }
    } else {
      addVenue(newVenue);
    }

    setIsSubmitting(false);
    // Directly redirect to view venue right from there!
    navigate(`/my-venues/${savedId}`);
  };



  return (
    <section
      className="relative w-full min-h-screen text-white pb-20 overflow-y-auto text-left"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      <Navbar />

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1
              className="font-normal text-white text-[2.2rem] sm:text-[3rem] tracking-tight leading-none"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro 55 Roman', 'Helvetica Neue', Arial, sans-serif", letterSpacing: '-0.035em' }}
            >
              List New{' '}
              <span className="text-[#c5a059] bg-gradient-to-r from-[#c5a059] to-[#dfba75] bg-clip-text text-transparent font-medium">
                Venue
              </span>
            </h1>
            <p className="text-white/60 text-xs sm:text-sm max-w-xl">
              Fill out the visual template below to list your event space. Edit details inline to see how it shapes up.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/my-venues')}
              className="group flex items-center gap-2 text-white/50 hover:text-[#c5a059] text-xs font-semibold transition-all bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full border border-white/5"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Cancel Listing
            </button>
          </div>
        </div>

        {/* Live Visual Showcase Image Grid */}
        <div className="flex flex-col gap-4 mb-12 w-full">
          <div className="relative h-[320px] sm:h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black w-full">
            <img
              src={imageUrls[activeImageIdx] || MOCK_IMAGES[0]}
              alt={`${title || 'Venue'} preview`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-5 right-5 bg-black/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs text-white/80 border border-white/10">
              Photo {activeImageIdx + 1} of {imageUrls.length}
            </div>
          </div>

          {/* Thumbnail Selection list */}
          <div className="flex gap-3 overflow-x-auto pb-1.5 custom-scrollbar">
            {imageUrls.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={cn(
                  "relative flex-shrink-0 w-24 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 active:scale-95",
                  activeImageIdx === idx
                    ? "border-[#c5a059] scale-[1.03] shadow-lg shadow-[#c5a059]/10"
                    : "border-white/10 hover:border-white/30"
                )}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                {activeImageIdx !== idx && (
                  <div className="absolute inset-0 bg-black/40 transition-opacity hover:opacity-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Column Layout Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form Inputs styled inline */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0e0e12]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-8">
              
              {/* Step 1: Overview & Specs */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  <Settings className="w-4 h-4" /> Overview & Details
                </h3>

                {/* Venue Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Venue Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. The Glass Pavilion"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrors(prev => ({ ...prev, title: '' }));
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]/40 transition-all",
                      errors.title && "border-red-500/50 focus:border-red-500"
                    )}
                  />
                  {errors.title && (
                    <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1"><BadgeAlert className="w-3 h-3" /> {errors.title}</span>
                  )}
                </div>

                {/* Description Overview */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Two Line Description Overview *</label>
                  <textarea
                    placeholder="e.g. An architectural masterpiece featuring 360-degree glass walls, high ceilings, and stunning garden views."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors(prev => ({ ...prev, description: '' }));
                    }}
                    rows={3}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]/40 transition-all resize-none",
                      errors.description && "border-red-500/50 focus:border-red-500"
                    )}
                  />
                  {errors.description && (
                    <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1"><BadgeAlert className="w-3 h-3" /> {errors.description}</span>
                  )}
                </div>

                {/* Specs row: Capacity, SqFt, City */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Max Capacity *</label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={capacity === 0 ? '' : capacity}
                      onChange={(e) => {
                        setCapacity(Number(e.target.value));
                        setErrors(prev => ({ ...prev, capacity: '' }));
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c5a059]/40",
                        errors.capacity && "border-red-500/50"
                      )}
                    />
                    {errors.capacity && (
                      <span className="text-[10px] text-red-400 block mt-1">{errors.capacity}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Space Area (Sq Ft) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 8500"
                      value={squareFeet === 0 ? '' : squareFeet}
                      onChange={(e) => {
                        setSquareFeet(Number(e.target.value));
                        setErrors(prev => ({ ...prev, squareFeet: '' }));
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c5a059]/40",
                        errors.squareFeet && "border-red-500/50"
                      )}
                    />
                    {errors.squareFeet && (
                      <span className="text-[10px] text-red-400 block mt-1">{errors.squareFeet}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Town Name (City) *</label>
                    <input
                      type="text"
                      placeholder="e.g. Los Angeles"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setErrors(prev => ({ ...prev, location: '' }));
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c5a059]/40",
                        errors.location && "border-red-500/50"
                      )}
                    />
                    {errors.location && (
                      <span className="text-[10px] text-red-400 block mt-1">{errors.location}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Booking Type Config */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  <Calendar className="w-4 h-4" /> Booking Configuration
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Booking Type *</label>
                    <select
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value as 'days' | 'hours')}
                      className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c5a059]/40"
                    >
                      <option value="days" className="bg-[#0e0e12] text-white">Daily Based</option>
                      <option value="hours" className="bg-[#0e0e12] text-white">Hourly Based</option>
                    </select>
                  </div>
                  {bookingType === 'hours' && (
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Cleaning Gap (Hours)</label>
                      <input
                        type="number"
                        min={0}
                        max={12}
                        value={cleaningGap}
                        onChange={(e) => setCleaningGap(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
                {bookingType === 'hours' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Opening Time *</label>
                      <input
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Closing Time *</label>
                      <input
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Perfect For & Amenities */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  <Sparkles className="w-4 h-4" /> Perfect For & Amenities
                </h3>

                {/* Event categories presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Perfect For (Event Categories)</label>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {availableEventTypes.map((type) => {
                      const isSelected = selectedEventTypes.includes(type);
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => toggleEventType(type)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs border transition-colors",
                            isSelected
                              ? "bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/45 font-medium"
                              : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white"
                          )}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 pt-1 max-w-xs">
                    <input
                      type="text"
                      placeholder="Custom Category..."
                      value={customEventType}
                      onChange={(e) => setCustomEventType(e.target.value)}
                      className="flex-1 px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomEventType}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-2.5 rounded-lg text-xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Amenities grid */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Amenities Checklist *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableAmenities.map((item) => {
                      const isSelected = selectedAmenities.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleAmenity(item)}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-xl text-xs border text-left transition-colors",
                            isSelected
                              ? "bg-white/5 text-white border-[#c5a059]/30"
                              : "bg-white/[0.01] border-white/5 text-white/40 hover:text-white"
                          )}
                        >
                          <div className={cn(
                            "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0",
                            isSelected ? "border-[#c5a059] bg-[#c5a059] text-black" : "border-white/20"
                          )}>
                            {isSelected && <Check className="w-2.5 h-2.5 font-bold" />}
                          </div>
                          <span className="truncate">{item}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 pt-1 max-w-xs">
                    <input
                      type="text"
                      placeholder="Custom Amenity..."
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                      className="flex-1 px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-2.5 rounded-lg text-xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4: Location & Parking */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  <MapPin className="w-4 h-4" /> Location & Parking Accommodations
                </h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Full Location (Street Address) *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10450 Wilshire Blvd, Los Angeles, CA 90024"
                    value={fullAddress}
                    onChange={(e) => {
                      setFullAddress(e.target.value);
                      setErrors(prev => ({ ...prev, fullAddress: '' }));
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059]/40",
                      errors.fullAddress && "border-red-500/50"
                    )}
                  />
                  {errors.fullAddress && (
                    <span className="text-[10px] text-red-400 block mt-1">{errors.fullAddress}</span>
                  )}
                </div>
                
                <div className="pt-2 pb-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Pin Location on Map</label>
                  <LocationPicker
                    value={latitude && longitude ? { latitude, longitude } : null}
                    onChange={(coords) => {
                      setLatitude(coords.latitude);
                      setLongitude(coords.longitude);
                    }}
                    onAddressPicked={(addressInfo) => {
                      setFullAddress(addressInfo.formattedAddress);
                      if (addressInfo.city) {
                        setLocation(addressInfo.city);
                      }
                      setErrors(prev => ({ ...prev, fullAddress: '', location: '' }));
                    }}
                  />

                  {/* Manual Coordinates Override */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full mt-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Latitude (Manual Override)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 11.8745"
                        value={latitude === null || latitude === undefined ? '' : latitude}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : Number(e.target.value);
                          setLatitude(val);
                        }}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c5a059]/40"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Longitude (Manual Override)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 75.3704"
                        value={longitude === null || longitude === undefined ? '' : longitude}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : Number(e.target.value);
                          setLongitude(val);
                        }}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c5a059]/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Parking Accommodations</label>
                  <textarea
                    placeholder="Describe valet, underground secure parking garage, active EV charging slots..."
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white resize-none"
                  />
                </div>
              </div>

              {/* Step 5: Policies & Rules */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  <ShieldAlert className="w-4 h-4" /> Policies & Guidelines
                </h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Food & Catering Policy</label>
                  <textarea
                    placeholder="Describe catering policies, outside food permissions, license demands..."
                    value={catering}
                    onChange={(e) => setCatering(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white resize-none"
                  />
                </div>

                {/* Rules editor */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">House Rules</label>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Add a house rule..."
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddRule}
                      className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs px-3"
                    >
                      + Add
                    </button>
                  </div>
                  <ul className="space-y-1.5 bg-black/20 border border-white/5 p-3.5 rounded-xl max-w-md">
                    {rules.map((rule, idx) => (
                      <li key={idx} className="flex justify-between items-center gap-2 text-xs text-white/60">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] mt-0.5" />
                          <span>{rule}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          className="text-white/30 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step 6: Visual Gallery media manager */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  <Building className="w-4 h-4" /> Media Gallery * (Min 3 Images)
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {MOCK_IMAGES.map((img, idx) => {
                      const isAdded = imageUrls.includes(img);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              setImageUrls(imageUrls.filter(u => u !== img));
                            } else {
                              setImageUrls([...imageUrls, img]);
                            }
                            setErrors(prev => ({ ...prev, images: '' }));
                          }}
                          className={cn(
                            "relative w-16 h-12 rounded-lg overflow-hidden border flex-shrink-0 transition-transform active:scale-95",
                            isAdded ? "border-[#c5a059]" : "border-white/10 opacity-60"
                          )}
                        >
                          <img src={img} className="w-full h-full object-cover" alt="Preset option" />
                          {isAdded && (
                            <div className="absolute inset-0 bg-[#c5a059]/20 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-black font-bold bg-white rounded-full p-0.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-3 max-w-md bg-white/[0.01] border border-white/5 p-3.5 rounded-2xl">
                    {/* URL Option */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste a custom image URL..."
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs px-3"
                      >
                        Add URL
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <hr className="flex-1 border-white/5" />
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">OR</span>
                      <hr className="flex-1 border-white/5" />
                    </div>

                    {/* File Upload Option */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                        id="image-file-upload"
                      />
                      <label
                        htmlFor="image-file-upload"
                        className={cn(
                          "flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white cursor-pointer transition-all",
                          isUploading && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isUploading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Uploading image...</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-4 h-4 text-[#c5a059]" />
                            <span>Upload Image File</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 pt-1 max-w-md">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 bg-white/[0.01] border border-white/5 p-1.5 rounded-lg text-[10px]">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img src={url} className="w-6 h-6 rounded object-cover flex-shrink-0" alt="Thumbnail" />
                          <span className="truncate text-white/50 font-mono">{url}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-white/40 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {errors.images && (
                      <span className="text-[10px] text-red-400 flex items-center gap-1 mt-1"><BadgeAlert className="w-3 h-3" /> {errors.images}</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Calculations + Controls */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            {/* Publisher Control panel */}
            <div className="bg-[#0e0e12]/95 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">
              <div className="space-y-2 text-center">
                <h4 className="text-base font-bold text-white">Publish Space</h4>
                <p className="text-[10px] text-white/50">List your new venue on the main directory page.</p>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black font-bold rounded-2xl h-11 text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/10"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    'Publish Listing Space'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/my-venues')}
                  className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl h-11 text-xs transition-all"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Calculations Card */}
            <div className="bg-[#0e0e12]/80 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a059] flex items-center gap-1.5 pb-2 border-b border-white/5">
                <Star className="w-3.5 h-3.5" /> Standard Booking Fees (Live)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-1">
                    {bookingType === 'hours' ? 'Standard Hourly Rate *' : 'Standard Daily Rate *'}
                  </label>
                  <div className="relative rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 flex items-center">
                    <span className="text-sm text-white/50 mr-1.5">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 450"
                      value={pricePerNight === 0 ? '' : pricePerNight}
                      onChange={(e) => {
                        setPricePerNight(Number(e.target.value));
                        setErrors(prev => ({ ...prev, pricePerNight: '' }));
                      }}
                      className="bg-transparent text-sm text-white focus:outline-none w-full font-semibold"
                    />
                  </div>
                  {errors.pricePerNight && (
                    <span className="text-[10px] text-red-400 mt-1 block">{errors.pricePerNight}</span>
                  )}
                </div>

                <hr className="border-white/10" />

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span className="font-light">Base booking rate</span>
                    <span className="font-semibold text-white">₹{basePrice}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="font-light">Service & cleaning fee (15%)</span>
                    <span className="font-semibold text-white">₹{serviceFee}</span>
                  </div>
                  <hr className="border-white/10 border-dashed" />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-white/80">Total ({bookingType === 'hours' ? '1 Hour' : '1 Day'})</span>
                    <span className="text-base font-extrabold text-[#c5a059]">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Card Mock Preview */}
            <div className="bg-[#0e0e12]/40 border border-white/5 p-4 rounded-3xl backdrop-blur-sm space-y-3">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Live Visual Mock</span>
              <div className="relative h-32 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img src={imageUrls[0] || MOCK_IMAGES[0]} alt="Showcase Visual Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] border border-white/10">
                  {location || 'Los Angeles'}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] text-[#c5a059] font-bold">
                  ★ 4.9 Rating
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold truncate text-white">{title || 'The Glass Pavilion'}</h4>
                <p className="text-[10px] text-white/50 truncate mt-0.5">{description || 'Description summary...'}</p>
              </div>
            </div>

          </div>

        </form>

      </div>
    </section>
  );
}
