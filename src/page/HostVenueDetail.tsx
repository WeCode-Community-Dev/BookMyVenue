import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, Car, Check, ShieldAlert, Utensils,
  Maximize2, Calendar, Star, Sparkles, Phone, Mail, ArrowRight,
  CheckCircle, Info, Edit, Trash2, X, AlertCircle, PlusCircle, Trash,
  TrendingUp, CalendarRange, Building, Settings, RefreshCw, BadgeAlert
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Venue } from '../data/venuesData';
import InteractiveCalendar from '@/components/ui/visualize-booking';
import { VenueMap, LocationPicker } from '@/components/map';

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

export default function HostVenueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // View states
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<number>(0);
  const [squareFeet, setSquareFeet] = useState<number>(0);
  const [pricePerNight, setPricePerNight] = useState<number>(0);
  const [bookingType, setBookingType] = useState<'days' | 'hours'>('days');
  const [cleaningGap, setCleaningGap] = useState<number>(0);
  const [openingTime, setOpeningTime] = useState<string>('08:00');
  const [closingTime, setClosingTime] = useState<string>('22:00');
  const [hostType, setHostType] = useState('Superhost');
  const [isTopRated, setIsTopRated] = useState(true);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [customEventType, setCustomEventType] = useState('');

  const [catering, setCatering] = useState('');
  const [parking, setParking] = useState('');

  const [rules, setRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableEventTypes = Array.from(new Set([...PRESET_EVENT_TYPES, ...selectedEventTypes]));
  const availableAmenities = Array.from(new Set([...PRESET_AMENITIES, ...selectedAmenities]));

  const triggerToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    // Authenticate user
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login?redirect=/my-venues');
      return;
    }

    try {
      const userObj = JSON.parse(userStr);
      setCurrentUser(userObj);
      if (userObj.role !== 'venue_owner') {
        navigate('/');
      }
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchVenueData = async () => {
    if (!id) return;
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      // Fetch details
      const response = await fetch(`http://localhost:5000/api/venues/${id}`);
      let venueData: Venue | null = null;
      if (response.ok) {
        venueData = await response.json();
      }

      if (venueData) {
        setVenue(venueData);
        populateForm(venueData);
      }

      const bookingsResponse = await fetch(`http://localhost:5000/api/venues/${id}/bookings`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching venue details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchVenueData();
    }
  }, [currentUser, id]);

  useEffect(() => {
    // Check if edit mode is requested in URL params
    const editParam = searchParams.get('edit');
    if (editParam === 'true') {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [searchParams]);

  const populateForm = (v: Venue) => {
    setTitle(v.title);
    setDescription(v.description);
    setLocation(v.location);
    setFullAddress(v.fullAddress || '');
    setLatitude(v.latitude !== undefined && v.latitude !== null ? v.latitude : null);
    setLongitude(v.longitude !== undefined && v.longitude !== null ? v.longitude : null);
    setCapacity(v.capacity);
    setSquareFeet(v.squareFeet || 0);
    setPricePerNight(v.pricePerNight);
    setBookingType(v.bookingType || 'days');
    setCleaningGap(v.cleaningGap || 0);
    setOpeningTime(v.openingTime || '08:00');
    setClosingTime(v.closingTime || '22:00');
    setHostType(v.hostType || 'Superhost');
    setIsTopRated(v.isTopRated !== undefined ? v.isTopRated : true);
    setImageUrls(v.images || []);
    setSelectedAmenities(v.amenities || []);
    setSelectedEventTypes(v.eventTypes || []);
    setCatering(v.catering || '');
    setParking(v.parking || '');
    setRules(v.rules || []);
  };

  // Live Pricing Calculations
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
          triggerToast('Image uploaded successfully!', 'success');
        }
      } else {
        const errorData = await response.json();
        triggerToast(errorData.message || 'Failed to upload image.', 'error');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      triggerToast('Error uploading image.', 'error');
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

  // Form validation
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!title.trim()) tempErrors.title = 'Title is required.';
    if (!description.trim()) tempErrors.description = 'Description is required.';
    if (!fullAddress.trim()) tempErrors.fullAddress = 'Full Location / Street Address is required.';
    if (!location.trim()) tempErrors.location = 'Town Name is required.';
    if (capacity <= 0) tempErrors.capacity = 'Capacity must be greater than zero.';
    if (squareFeet <= 0) tempErrors.squareFeet = 'Space Area must be greater than zero.';
    if (pricePerNight <= 0) tempErrors.pricePerNight = 'Rate must be greater than zero.';
    if (imageUrls.length < 3) tempErrors.images = 'A minimum of three images is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Form submit handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) return;

    setIsSaving(true);
    const token = localStorage.getItem('token');

    const tags = [
      location,
      `${capacity} Guests`,
      isTopRated ? 'Luxury' : 'Handpicked'
    ];

    const updatedPayload = {
      title,
      description,
      location,
      fullAddress,
      latitude,
      longitude,
      capacity: Number(capacity),
      squareFeet: Number(squareFeet),
      pricePerNight: Number(pricePerNight),
      dateRange: venue?.dateRange || 'Available',
      parking,
      catering,
      images: imageUrls,
      amenities: selectedAmenities,
      rules,
      eventTypes: selectedEventTypes,
      bookingType,
      cleaningGap: Number(cleaningGap),
      openingTime,
      closingTime,
      hostType,
      isTopRated,
      tags
    };

    try {
      const response = await fetch(`http://localhost:5000/api/venues/${id}`, {
        method: 'PUT',
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
          is_top_rated: isTopRated,
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
        const resData = await response.json();
        setVenue(resData.venue || { ...venue!, ...updatedPayload });
        triggerToast('Venue updated successfully!', 'success');
        setSearchParams({});
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        triggerToast(errorData.message || 'Failed to update venue.', 'error');
      }
    } catch (err) {
      console.error('Failed to update venue:', err);
      triggerToast('Failed to update venue.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEditMode = (edit: boolean) => {
    if (edit) {
      setSearchParams({ edit: 'true' });
    } else {
      if (venue) populateForm(venue); // Reset form state
      setSearchParams({});
    }
  };

  // Helper date parsing
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="relative w-full min-h-screen text-white bg-[#0a0a0c] flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading venue dashboard...</h2>
        </div>
      </section>
    );
  }

  if (!venue) {
    return (
      <section className="relative w-full min-h-screen text-white bg-[#0a0a0c] flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-3xl font-bold">Venue Not Found</h2>
          <p className="text-white/60 text-sm">We couldn't locate this listing.</p>
          <Button onClick={() => navigate('/my-venues')} className="bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-full mt-4">
            Back to Listings
          </Button>
        </div>
      </section>
    );
  }

  // Active bookings calculation
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">

        {/* Navigation and Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/my-venues')}
            className="group flex items-center gap-2 text-white/50 hover:text-[#c5a059] text-sm font-semibold transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 hover:border-[#c5a059]/20 self-start"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to My Listings
          </button>
        </div>

        {/* Title / Form Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          {isEditing ? (
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-normal tracking-tight">
                Edit <span className="text-[#c5a059] bg-gradient-to-r from-[#c5a059] to-[#dfba75] bg-clip-text text-transparent font-medium">{venue.title}</span>
              </h1>
              <p className="text-xs text-white/50">Modify details below to update standard settings</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">

                  {/* Status Badge */}
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border",
                    venue.status === "approved"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : venue.status === "declined"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      venue.status === "approved" ? "bg-green-400" : venue.status === "declined" ? "bg-red-400" : "bg-yellow-400"
                    )} />
                    {venue.status ? venue.status.toUpperCase() : 'PENDING'}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
                  {venue.title}
                </h1>
                <div className="flex items-center gap-1.5 text-white/50 text-sm mt-2">
                  <MapPin className="w-4 h-4 text-[#c5a059]" />
                  <span>{venue.fullAddress || venue.location}</span>
                </div>

                {venue.status === 'declined' && venue.rejectionReason && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-sm max-w-xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold">Rejection Reason</h4>
                      <p className="opacity-90 mt-1">{venue.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Widescreen Cinematic Image Showcase */}
        <div className="flex flex-col gap-4 mb-12 w-full">
          <div className="relative h-[320px] sm:h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group w-full bg-black">
            <img
              src={isEditing ? (imageUrls[activeImageIdx] || MOCK_IMAGES[0]) : (venue.images[activeImageIdx] || MOCK_IMAGES[0])}
              alt={`${title} view`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-5 right-5 bg-black/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs text-white/80 border border-white/10">
              Photo {activeImageIdx + 1} of {isEditing ? imageUrls.length : venue.images.length}
            </div>
          </div>

          {/* Thumbnail row */}
          <div className="flex gap-3 overflow-x-auto pb-1.5 custom-scrollbar">
            {(isEditing ? imageUrls : venue.images).map((img, idx) => (
              <button
                key={idx}
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

        {/* Unified Twin Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT COLUMN: View Specs or Edit Fields */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0e0e12]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-8">

              {!isEditing ? (
                // VIEW MODE DETAIL PANELS
                <>
                  {/* Overview details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                      <Info className="w-4 h-4" /> Overview & Specs
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-white/5 text-sm text-white/70">
                      <div className="flex items-center gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                        <Users className="w-4 h-4 text-[#c5a059]" />
                        <span><strong>Max Capacity:</strong> {venue.capacity} Guests</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                        <Maximize2 className="w-4 h-4 text-[#c5a059]" />
                        <span><strong>Space Area:</strong> {venue.squareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                        <MapPin className="w-4 h-4 text-[#c5a059]" />
                        <span><strong>Location:</strong> {venue.location}</span>
                      </div>
                    </div>

                    <p className="text-base text-white/80 leading-relaxed font-light pt-2">
                      {venue.description}
                    </p>

                    <div className="pt-2">
                      <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Perfect For</h4>
                      <div className="flex flex-wrap gap-2">
                        {venue.eventTypes.map((type) => (
                          <Badge
                            key={type}
                            className="bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 text-xs font-medium py-1.5 px-4 rounded-full"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                      <Sparkles className="w-4 h-4" /> Amenities Checklist
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {venue.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 flex-shrink-0">
                            <Check className="w-4 h-4 text-[#c5a059]" />
                          </div>
                          <span className="text-sm text-white/80">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location and Parking details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                      <MapPin className="w-4 h-4" /> Location & Parking
                    </h3>
                    <div className="space-y-4 pt-1">
                      <div>
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Street Address</h4>
                        <p className="text-sm text-white/90 bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-light leading-relaxed mb-4">
                          {venue.fullAddress}
                        </p>
                        <VenueMap
                          latitude={venue.latitude}
                          longitude={venue.longitude}
                          venueName={venue.title}
                          address={venue.fullAddress}
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Car className="w-4 h-4 text-[#c5a059]" /> Parking Accommodations
                        </h4>
                        <p className="text-sm text-white/70 leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-light">
                          {venue.parking}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Policies & Guidelines */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                      <ShieldAlert className="w-4 h-4" /> Policies & House Rules
                    </h3>
                    <div className="space-y-4 pt-1">
                      <div>
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Utensils className="w-4 h-4 text-[#c5a059]" /> Food & Catering Policy
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-light">
                          {venue.catering}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">House Rules</h4>
                        <ul className="space-y-3">
                          {venue.rules.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] mt-2 flex-shrink-0" />
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // EDIT MODE FORM FIELDS (styled exactly like AddVenue.tsx)
                <form onSubmit={handleSave} className="space-y-6">

                  {/* Step 1: Venue Title & Overview */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                      <Settings className="w-4 h-4" /> Overview & Details
                    </h3>

                    {/* Venue Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Venue Name *</label>
                      <input
                        type="text"
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

                    {/* Description overview */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Two Line Description Overview *</label>
                      <textarea
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

                    {/* Specs Triple: Capacity, Area, City */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Max Capacity *</label>
                        <input
                          type="number"
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
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Space Area (Sq Ft) *</label>
                        <input
                          type="number"
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
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Town Name (City) *</label>
                        <input
                          type="text"
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
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Booking settings */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                      <CalendarRange className="w-4 h-4" /> Booking Configuration
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

                    {/* Event Categories */}
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

                    {/* Amenities list */}
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
                        value={fullAddress}
                        onChange={(e) => {
                          setFullAddress(e.target.value);
                          setErrors(prev => ({ ...prev, fullAddress: '' }));
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c5a059]/40",
                          errors.fullAddress && "border-red-500/50"
                        )}
                      />
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
                        value={catering}
                        onChange={(e) => setCatering(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white resize-none"
                      />
                    </div>

                    {/* Rules list editor */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">House Rules</label>
                      <div className="flex gap-2 max-w-md">
                        <input
                          type="text"
                          placeholder="Add rule..."
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
                      <ul className="space-y-1.5 bg-black/20 border border-white/5 p-3 rounded-xl max-w-md">
                        {rules.map((rule, idx) => (
                          <li key={idx} className="flex justify-between items-center gap-2 text-xs text-white/60">
                            <span className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#c5a059]" />
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

                  {/* Step 6: Images URLs gallery manager */}
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
                              <img src={img} className="w-full h-full object-cover" alt="preset option" />
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

                </form>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Control Panel + Analytics OR Edit Live Calculations */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">

            {/* Host Control panel card */}
            <div className="bg-[#0e0e12]/95 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">

              {!isEditing ? (
                // VIEW MODE CONTROL ACTIONS
                <>
                  {/* Actions buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-2xl h-11 text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Building className="w-4 h-4" />
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => toggleEditMode(true)}
                      className="w-full bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 h-11 text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4 text-[#c5a059]" />
                      Edit Venue Settings
                    </Button>
                  </div>
                </>
              ) : (
                // EDIT MODE CONTROLS
                <>
                  <div className="space-y-2 text-center">
                    <h4 className="text-base font-bold text-white">Save Venue Settings</h4>
                    <p className="text-[10px] text-white/50">Save details below to push changes live instantly.</p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-[#c5a059] hover:bg-[#b08e4d] text-black font-bold rounded-2xl h-11 text-xs transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button
                      onClick={() => toggleEditMode(false)}
                      className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl h-11 text-xs transition-all"
                    >
                      Cancel Edit
                    </Button>
                  </div>
                </>
              )}

            </div>

            {/* Price Calculations / Preview widget (Edit Mode Only) */}
            {isEditing && (
              // EDIT MODE STANDARD CALCULATIONS & PREVIEW CARD
              <div className="space-y-6">

                {/* Standard Fee card */}
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

                {/* Live Mock Preview card */}
                <div className="bg-[#0e0e12]/40 border border-white/5 p-4 rounded-3xl backdrop-blur-sm space-y-3">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block">Live Visual Mock</span>
                  <div className="relative h-32 rounded-2xl overflow-hidden border border-white/10 bg-black">
                    <img src={imageUrls[0] || MOCK_IMAGES[0]} alt="Showcase Visual Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] border border-white/10">
                      {location || 'Los Angeles'}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] text-[#c5a059] font-bold">
                      ★ {venue.rating || 4.9} Rating
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold truncate text-white">{title || 'The Glass Pavilion'}</h4>
                    <p className="text-[10px] text-white/50 truncate mt-0.5">{description || 'Description summary...'}</p>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Global Toast Notice */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#0e0e12] border border-white/10 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span className="text-xs font-medium text-white/90">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
