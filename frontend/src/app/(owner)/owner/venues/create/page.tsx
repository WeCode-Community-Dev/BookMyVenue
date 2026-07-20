'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

const AMENITY_OPTIONS = [
  'WiFi',
  'Projector / Screen',
  'Sound System',
  'Microphones',
  'Whiteboard',
  'Catering Service',
  'Parking Lot',
  'Air Conditioning',
  'Stage',
];

const TYPE_OPTIONS = [
  'Conference Room',
  'Banquet Hall',
  'Studio',
  'Auditorium',
  'Outdoor Space',
  'Co-working Space',
  'Other',
];

const parseTime24h = (timeStr: string) => {
  const parts = (timeStr || "09:00").split(":");
  let hour = parseInt(parts[0], 10);
  const minute = parts[1] || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const hourStr = hour.toString().padStart(2, "0");
  return { hour: hourStr, minute, ampm };
};

const buildTime24h = (hourStr: string, minuteStr: string, ampm: string): string => {
  let hour = parseInt(hourStr, 10);
  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${minuteStr}`;
};

export default function OwnerCreateVenuePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Conference Room');
  const [capacity, setCapacity] = useState<number>(10);
  const [location, setLocation] = useState('');
  const [pricePerHour, setPricePerHour] = useState<number>(50); // reused for Hourly pricePerHour
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<string[]>(AMENITY_OPTIONS);
  const [newAmenityInput, setNewAmenityInput] = useState('');

  // Booking Configuration State (Step 2)
  const [fixedSlots, setFixedSlots] = useState(true);
  const [hourlyBooking, setHourlyBooking] = useState(false);
  const [customRequests, setCustomRequests] = useState(false);

  // Hourly Booking Config State (Step 3)
  const [hourlyStartTime, setHourlyStartTime] = useState('09:00');
  const [hourlyEndTime, setHourlyEndTime] = useState('22:00');
  const [hourlyMinHours, setHourlyMinHours] = useState<number>(1);
  const [hourlyMaxHours, setHourlyMaxHours] = useState<number>(12);

  // Custom Booking Requests Config State (Step 3)
  const [customOwnerApprovalRequired, setCustomOwnerApprovalRequired] = useState(true);
  const [customMinNoticeHours, setCustomMinNoticeHours] = useState<number>(24);

  interface PredefinedSlot {
    name?: string;
    startTime: string;
    endTime: string;
    price: number;
  }

  // Availability Schedule State (Fixed Packages)
  const [sameTiming, setSameTiming] = useState(true);
  const [availability, setAvailability] = useState<{
    [key: string]: {
      isOpen: boolean;
      slots: PredefinedSlot[];
    };
  }>({
    monday: { isOpen: true, slots: [] },
    tuesday: { isOpen: true, slots: [] },
    wednesday: { isOpen: true, slots: [] },
    thursday: { isOpen: true, slots: [] },
    friday: { isOpen: true, slots: [] },
    saturday: { isOpen: true, slots: [] },
    sunday: { isOpen: false, slots: [] },
  });

  const [newSlotInput, setNewSlotInput] = useState<{
    [key: string]: {
      name: string;
      startTime: string;
      endTime: string;
      price: number;
    }
  }>({
    monday: { name: '', startTime: '09:00', endTime: '10:00', price: 50 },
    tuesday: { name: '', startTime: '09:00', endTime: '10:00', price: 50 },
    wednesday: { name: '', startTime: '09:00', endTime: '10:00', price: 50 },
    thursday: { name: '', startTime: '09:00', endTime: '10:00', price: 50 },
    friday: { name: '', startTime: '09:00', endTime: '10:00', price: 50 },
    saturday: { name: '', startTime: '09:00', endTime: '10:00', price: 50 },
    sunday: { name: '', startTime: '09:00', endTime: '10:00', price: 50 },
  });

  const DAYS_OF_WEEK = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const formatTo24h = (timeStr: string): string => {
    if (!timeStr) return "00:00";
    if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
      const match = timeStr.match(/^(\d+):(\d+)\s*(am|pm)$/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const ampm = match[3].toLowerCase();
        if (ampm === "pm" && hours < 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, "0")}:${minutes}`;
      }
    }
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      }
    }
    return timeStr;
  };

  const formatTime12h = (timeStr: string): string => {
    if (!timeStr) return "";
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;
    const hour = parseInt(parts[0], 10);
    const minute = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}:${minute} ${ampm}`;
  };

  const addSlot = (dayKey: string) => {
    const input = newSlotInput[dayKey];
    if (!input.startTime || !input.endTime) return;
    
    const formattedStart = formatTo24h(input.startTime);
    const formattedEnd = formatTo24h(input.endTime);

    if (formattedStart >= formattedEnd) {
      alert("Start time must be before end time!");
      return;
    }

    const newSlot: PredefinedSlot = {
      name: input.name.trim() || undefined,
      startTime: formattedStart,
      endTime: formattedEnd,
      price: Number(input.price) || 0,
    };

    setAvailability((prev) => {
      const daySlots = prev[dayKey].slots || [];
      const updatedSlots = [...daySlots, newSlot].sort((a, b) => a.startTime.localeCompare(b.startTime));
      const updated = {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: updatedSlots,
        }
      };

      if (sameTiming) {
        Object.keys(updated).forEach((day) => {
          if (day !== dayKey && updated[day].isOpen) {
            updated[day].slots = [...updatedSlots];
          }
        });
      }
      return updated;
    });

    // Reset name input after adding
    setNewSlotInput((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        name: '',
      }
    }));
  };

  const removeSlot = (dayKey: string, slotIndex: number) => {
    setAvailability((prev) => {
      const daySlots = prev[dayKey].slots || [];
      const updatedSlots = daySlots.filter((_, idx) => idx !== slotIndex);
      const updated = {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          slots: updatedSlots,
        }
      };

      if (sameTiming) {
        Object.keys(updated).forEach((day) => {
          if (day !== dayKey && updated[day].isOpen) {
            updated[day].slots = [...updatedSlots];
          }
        });
      }
      return updated;
    });
  };

  const toggleDayOpen = (dayKey: string) => {
    setAvailability((prev) => {
      const isNowOpen = !prev[dayKey].isOpen;
      const updated = {
        ...prev,
        [dayKey]: {
          ...prev[dayKey],
          isOpen: isNowOpen,
          slots: !isNowOpen ? [] : (sameTiming ? [...prev.monday.slots] : []),
        }
      };
      
      if (sameTiming && dayKey === 'monday') {
        Object.keys(updated).forEach((day) => {
          updated[day].isOpen = isNowOpen;
          updated[day].slots = isNowOpen ? [...prev.monday.slots] : [];
        });
      }
      return updated;
    });
  };

  const handleSlotInputChange = (dayKey: string, field: string, value: any) => {
    setNewSlotInput((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      }
    }));
  };

  const sanitizeAvailability = (avail: typeof availability) => {
    const sanitized: any = {};
    Object.keys(avail).forEach((day) => {
      sanitized[day] = {
        isOpen: avail[day].isOpen,
        slots: (avail[day].slots || []).map(s => ({
          name: s.name ? s.name.trim() : undefined,
          startTime: s.startTime,
          endTime: s.endTime,
          price: Number(s.price) || 0
        }))
      };
    });
    return sanitized;
  };

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'Venue owner') {
        router.push('/');
      } else {
        setCurrentUser(user);
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleAmenityChange = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    const trimmed = newAmenityInput.trim();
    if (!trimmed) return;
    if (!availableAmenities.includes(trimmed)) {
      setAvailableAmenities((prev) => [...prev, trimmed]);
    }
    if (!amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
    }
    setNewAmenityInput('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then((base64Strings) => {
        setSelectedImages((prev) => [...prev, ...base64Strings]);
      })
      .catch((err) => {
        console.error('Error reading files:', err);
        setErrorMsg('Failed to read one or more image files.');
      });
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          name.trim() !== '' &&
          type.trim() !== '' &&
          capacity > 0 &&
          location.trim() !== '' &&
          description.trim() !== ''
        );
      case 2:
        return fixedSlots || hourlyBooking || customRequests;
      case 3:
        if (fixedSlots) {
          const hasPackage = Object.values(availability).some(
            (day) => day.isOpen && day.slots && day.slots.length > 0
          );
          if (!hasPackage) return false;
        }
        if (hourlyBooking) {
          if (!hourlyStartTime || !hourlyEndTime || pricePerHour <= 0) {
            return false;
          }
        }
        if (customRequests) {
          if (customMinNoticeHours < 0) {
            return false;
          }
        }
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      if (isStepValid(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    if (!isStepValid(1) || !isStepValid(2) || !isStepValid(3)) {
      setErrorMsg('Please complete and validate all steps before submitting.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      let imagesArray = [...selectedImages];

      const payload = {
        name,
        type,
        capacity: Number(capacity),
        location,
        pricePerHour: Number(pricePerHour),
        images: imagesArray,
        description,
        amenities,
        availability: sanitizeAvailability(availability),
        bookingModes: {
          fixedSlots,
          hourlyBooking,
          customRequests,
        },
        hourlyBookingConfiguration: {
          enabled: hourlyBooking,
          startTime: hourlyStartTime,
          endTime: hourlyEndTime,
          pricePerHour: Number(pricePerHour),
          minimumHours: Number(hourlyMinHours),
          maximumHours: Number(hourlyMaxHours),
        },
        customBookingConfiguration: {
          enabled: customRequests,
          ownerApprovalRequired: customOwnerApprovalRequired,
          minimumNoticeHours: Number(customMinNoticeHours),
        }
      };

      await api.post('/venues', payload);

      setSuccess(true);
      setTimeout(() => {
        router.push('/owner/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to create venue:', err);
      const msg = err.response?.data?.message || 'Failed to create venue. Please check your inputs and try again.';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const stepsList = [
    { number: 1, name: 'Basic Information', desc: 'Venue details & images' },
    { number: 2, name: 'Booking Configuration', desc: 'Enable methods' },
    { number: 3, name: 'Availability & Pricing', desc: 'Pricing & times' },
    { number: 4, name: 'Amenities & Review', desc: 'Finalize listing' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              BookMyVenue
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/owner/dashboard" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="/owner/venues" className="text-indigo-600 font-semibold text-sm">
                My Venues
              </Link>
              <Link href="/owner/bookings" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Bookings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{currentUser.name}</span>
              <span className="text-xs text-slate-500 font-medium capitalize">{currentUser.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm transition-all duration-200 px-4 py-2 rounded-xl border border-rose-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/owner/venues" className="text-indigo-600 hover:text-indigo-500 font-semibold text-sm flex items-center gap-1.5 transition-colors">
            &larr; Back to Venues
          </Link>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Step {currentStep} of 4
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
          
          {/* Header text */}
          <div className="mb-8 border-b border-slate-100 pb-5">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">List a New Venue</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Complete the onboarding steps below to register your venue on the platform.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-10 px-2">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10 rounded-full">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full" 
                  style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
                />
              </div>
              
              {stepsList.map((s) => {
                const isCompleted = currentStep > s.number;
                const isActive = currentStep === s.number;
                return (
                  <div key={s.number} className="flex flex-col items-center">
                    <button
                      type="button"
                      disabled={!isCompleted && !isActive}
                      onClick={() => isStepValid(s.number - 1) && setCurrentStep(s.number)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 z-10 ${
                        isCompleted 
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 border-none cursor-pointer' 
                          : isActive 
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 border-none' 
                          : 'bg-white text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : s.number}
                    </button>
                    <span className={`hidden sm:inline text-[10px] font-bold mt-2 transition-colors duration-200 ${isActive ? 'text-indigo-600' : isCompleted ? 'text-slate-650' : 'text-slate-400'}`}>
                      {s.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2 animate-bounce">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Venue created successfully! Redirecting to Dashboard...</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step Content */}
            <div className="transition-all duration-300 ease-in-out opacity-100">
              
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
                  
                  <div>
                    <label htmlFor="venueName" className="block text-sm font-semibold text-slate-700">
                      Venue Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="venueName"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Grand Sapphire Ballroom"
                      className="mt-1.5 block w-full px-4 py-3 border border-slate-250 rounded-xl shadow-sm placeholder-slate-400 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="venueType" className="block text-sm font-semibold text-slate-700">
                        Venue Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="venueType"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1.5 block w-full px-4 py-3 border border-slate-250 rounded-xl shadow-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all cursor-pointer"
                      >
                        {TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="capacity" className="block text-sm font-semibold text-slate-700">
                        Max Capacity <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        required
                        min="1"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        placeholder="e.g. 150"
                        className="mt-1.5 block w-full px-4 py-3 border border-slate-250 rounded-xl shadow-sm placeholder-slate-400 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-slate-700">
                      Location Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Manhattan, New York"
                      className="mt-1.5 block w-full px-4 py-3 border border-slate-250 rounded-xl shadow-sm placeholder-slate-400 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Give details about your venue space, access, layout guidelines, rules, etc..."
                      className="mt-1.5 block w-full px-4 py-3 border border-slate-250 rounded-xl shadow-sm placeholder-slate-400 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all leading-relaxed"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Venue Images
                    </label>

                    {/* Drag and drop selection box */}
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-all cursor-pointer relative group">
                      <input
                        type="file"
                        id="deviceImages"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-1 text-center pointer-events-none">
                        <svg className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-slate-650 font-semibold justify-center">
                          <span className="text-indigo-650 hover:text-indigo-500">Upload files</span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 5MB each</p>
                      </div>
                    </div>

                    {/* Previews grid */}
                    {selectedImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        {selectedImages.map((base64, index) => (
                          <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                            <img src={base64} alt={`Selected ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeSelectedImage(index)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Booking Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Booking Configuration</h2>
                    <p className="text-slate-500 text-xs mt-1">
                      Select which booking methods are supported by this venue. You must enable at least one booking mode.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Fixed Packages Card */}
                    <div 
                      onClick={() => setFixedSlots(!fixedSlots)}
                      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        fixedSlots 
                          ? 'border-indigo-650 bg-indigo-50/50 shadow-md shadow-indigo-100/50' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl ${fixedSlots ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          fixedSlots ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {fixedSlots && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="font-bold text-slate-800 text-sm">Fixed Packages</h3>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                          Predefined daily/weekly time packages at fixed prices. Excellent for slots (e.g. turfs, courts, auditoriums).
                        </p>
                      </div>
                    </div>

                    {/* Hourly Booking Card */}
                    <div 
                      onClick={() => setHourlyBooking(!hourlyBooking)}
                      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        hourlyBooking 
                          ? 'border-indigo-650 bg-indigo-50/50 shadow-md shadow-indigo-100/50' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl ${hourlyBooking ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          hourlyBooking ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {hourlyBooking && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="font-bold text-slate-800 text-sm">Hourly Booking</h3>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                          Flexible booking based on hours with custom minimum and maximum limits. Great for studios and meeting rooms.
                        </p>
                      </div>
                    </div>

                    {/* Custom Requests Card */}
                    <div 
                      onClick={() => setCustomRequests(!customRequests)}
                      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        customRequests 
                          ? 'border-indigo-650 bg-indigo-50/50 shadow-md shadow-indigo-100/50' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl ${customRequests ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          customRequests ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {customRequests && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="font-bold text-slate-800 text-sm">Custom Requests</h3>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                          Allow customers to submit booking requests requiring manual approval. Perfect for weddings and banquets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Availability & Pricing */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Fixed Packages Config */}
                  {fixedSlots && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="text-base font-bold text-slate-800">Fixed Weekly Packages</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Configure individual time packages and pricing per day.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="sameTiming"
                            checked={sameTiming}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setSameTiming(val);
                              if (val) {
                                const mondaySlots = availability.monday.slots;
                                setAvailability((prev) => {
                                  const updated = { ...prev };
                                  Object.keys(updated).forEach((day) => {
                                    if (updated[day].isOpen) {
                                      updated[day].slots = [...mondaySlots];
                                    }
                                  });
                                  return updated;
                                });
                              }
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer"
                          />
                          <label htmlFor="sameTiming" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                            Mirror Monday's packages
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                        {DAYS_OF_WEEK.map((day) => {
                          const dayConfig = availability[day.key] || { isOpen: false, slots: [] };
                          const input = newSlotInput[day.key] || { name: '', startTime: '09:00', endTime: '10:00', price: 50 };
                          
                          if (sameTiming && day.key !== 'monday') {
                            return (
                              <div key={day.key} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                                <span className="text-xs font-bold text-slate-700 w-20">{day.label}</span>
                                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                  {dayConfig.isOpen ? (
                                    <span>Inherits {dayConfig.slots?.length || 0} package(s) from Monday</span>
                                  ) : (
                                    <span className="text-rose-500">Closed</span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => toggleDayOpen(day.key)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                      dayConfig.isOpen
                                        ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                        : 'bg-rose-50 border-rose-250 text-rose-700'
                                    }`}
                                  >
                                    {dayConfig.isOpen ? 'Open' : 'Closed'}
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={day.key} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                              <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{day.label}</span>
                                <button
                                  type="button"
                                  onClick={() => toggleDayOpen(day.key)}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                    dayConfig.isOpen
                                      ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                      : 'bg-rose-50 border-rose-250 text-rose-700'
                                  }`}
                                >
                                  {dayConfig.isOpen ? 'Open' : 'Closed'}
                                </button>
                              </div>

                              {dayConfig.isOpen && (
                                <div className="space-y-3">
                                  {/* Current slots list */}
                                  {(!dayConfig.slots || dayConfig.slots.length === 0) ? (
                                    <p className="text-xs text-slate-400 italic">No packages configured for this day.</p>
                                  ) : (
                                    <div className="flex flex-wrap gap-2">
                                      {dayConfig.slots.map((slot, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                                          {slot.name && <span className="text-slate-500 font-normal">{slot.name}:</span>}
                                          <span>{formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}</span>
                                          <span className="text-indigo-600">({slot.price})</span>
                                          <button
                                            type="button"
                                            onClick={() => removeSlot(day.key, idx)}
                                            className="text-rose-500 hover:text-rose-700 font-bold ml-1 text-sm focus:outline-none cursor-pointer"
                                          >
                                            &times;
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Add slot sub-form */}
                                  <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-slate-200/40">
                                    <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">Package Name</span>
                                      <input
                                        type="text"
                                        placeholder="e.g. Morning Package"
                                        value={input.name}
                                        onChange={(e) => handleSlotInputChange(day.key, 'name', e.target.value)}
                                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-[34px]"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">Start</span>
                                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm h-[34px]">
                                        <select
                                          value={parseTime24h(input.startTime).hour}
                                          onChange={(e) => {
                                            const { minute, ampm } = parseTime24h(input.startTime);
                                            const newTime = buildTime24h(e.target.value, minute, ampm);
                                            handleSlotInputChange(day.key, 'startTime', newTime);
                                          }}
                                          className="bg-transparent border-none text-xs focus:outline-none focus:ring-0 p-0 cursor-pointer font-bold text-slate-800"
                                        >
                                          {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map(h => (
                                            <option key={h} value={h}>{h}</option>
                                          ))}
                                        </select>
                                        <span className="text-slate-400 font-bold text-xs select-none">:</span>
                                        <select
                                          value={parseTime24h(input.startTime).minute}
                                          onChange={(e) => {
                                            const { hour, ampm } = parseTime24h(input.startTime);
                                            const newTime = buildTime24h(hour, e.target.value, ampm);
                                            handleSlotInputChange(day.key, 'startTime', newTime);
                                          }}
                                          className="bg-transparent border-none text-xs focus:outline-none focus:ring-0 p-0 cursor-pointer font-bold text-slate-800"
                                        >
                                          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(m => (
                                            <option key={m} value={m}>{m}</option>
                                          ))}
                                        </select>
                                        <select
                                          value={parseTime24h(input.startTime).ampm}
                                          onChange={(e) => {
                                            const { hour, minute } = parseTime24h(input.startTime);
                                            const newTime = buildTime24h(hour, minute, e.target.value);
                                            handleSlotInputChange(day.key, 'startTime', newTime);
                                          }}
                                          className="bg-transparent border-none text-[10px] focus:outline-none focus:ring-0 p-0.5 cursor-pointer font-extrabold text-indigo-650 bg-indigo-50 rounded ml-0.5"
                                        >
                                          <option value="AM">AM</option>
                                          <option value="PM">PM</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">End</span>
                                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm h-[34px]">
                                        <select
                                          value={parseTime24h(input.endTime).hour}
                                          onChange={(e) => {
                                            const { minute, ampm } = parseTime24h(input.endTime);
                                            const newTime = buildTime24h(e.target.value, minute, ampm);
                                            handleSlotInputChange(day.key, 'endTime', newTime);
                                          }}
                                          className="bg-transparent border-none text-xs focus:outline-none focus:ring-0 p-0 cursor-pointer font-bold text-slate-800"
                                        >
                                          {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map(h => (
                                            <option key={h} value={h}>{h}</option>
                                          ))}
                                        </select>
                                        <span className="text-slate-400 font-bold text-xs select-none">:</span>
                                        <select
                                          value={parseTime24h(input.endTime).minute}
                                          onChange={(e) => {
                                            const { hour, ampm } = parseTime24h(input.endTime);
                                            const newTime = buildTime24h(hour, e.target.value, ampm);
                                            handleSlotInputChange(day.key, 'endTime', newTime);
                                          }}
                                          className="bg-transparent border-none text-xs focus:outline-none focus:ring-0 p-0 cursor-pointer font-bold text-slate-800"
                                        >
                                          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(m => (
                                            <option key={m} value={m}>{m}</option>
                                          ))}
                                        </select>
                                        <select
                                          value={parseTime24h(input.endTime).ampm}
                                          onChange={(e) => {
                                            const { hour, minute } = parseTime24h(input.endTime);
                                            const newTime = buildTime24h(hour, minute, e.target.value);
                                            handleSlotInputChange(day.key, 'endTime', newTime);
                                          }}
                                          className="bg-transparent border-none text-[10px] focus:outline-none focus:ring-0 p-0.5 cursor-pointer font-extrabold text-indigo-650 bg-indigo-50 rounded ml-0.5"
                                        >
                                          <option value="AM">AM</option>
                                          <option value="PM">PM</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1 w-20">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">Price</span>
                                      <input
                                        type="number"
                                        min="0"
                                        value={input.price}
                                        onChange={(e) => handleSlotInputChange(day.key, 'price', Number(e.target.value) || 0)}
                                        className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-[34px]"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => addSlot(day.key)}
                                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer h-[34px]"
                                    >
                                      Add Package
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Hourly Booking Config */}
                  {hourlyBooking && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
                      <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Hourly Booking Configuration</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Operating Start Time</label>
                          <input 
                            type="time" 
                            value={hourlyStartTime}
                            onChange={(e) => setHourlyStartTime(e.target.value)}
                            className="mt-1.5 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Operating End Time</label>
                          <input 
                            type="time" 
                            value={hourlyEndTime}
                            onChange={(e) => setHourlyEndTime(e.target.value)}
                            className="mt-1.5 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Price Per Hour (RS) <span className="text-rose-500">*</span></label>
                          <input 
                            type="number" 
                            min="1"
                            value={pricePerHour}
                            onChange={(e) => setPricePerHour(Number(e.target.value))}
                            placeholder="e.g. 150"
                            className="mt-1.5 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Minimum Booking Hours</label>
                          <input 
                            type="number" 
                            min="1"
                            value={hourlyMinHours}
                            onChange={(e) => setHourlyMinHours(Number(e.target.value))}
                            className="mt-1.5 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Maximum Booking Hours</label>
                          <input 
                            type="number" 
                            min="1"
                            value={hourlyMaxHours}
                            onChange={(e) => setHourlyMaxHours(Number(e.target.value))}
                            className="mt-1.5 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Requests Config */}
                  {customRequests && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
                      <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Custom Requests Configuration</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="customOwnerApprovalRequired"
                            checked={customOwnerApprovalRequired}
                            onChange={(e) => setCustomOwnerApprovalRequired(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-350 text-indigo-650 focus:ring-indigo-550 cursor-pointer"
                          />
                          <label htmlFor="customOwnerApprovalRequired" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                            Manual Owner Approval Required
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Minimum Notice (Hours)</label>
                          <input 
                            type="number" 
                            min="0"
                            value={customMinNoticeHours}
                            onChange={(e) => setCustomMinNoticeHours(Number(e.target.value))}
                            className="mt-1.5 block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* STEP 4: Amenities & Review */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Amenities */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Amenities</h2>
                    <p className="text-slate-500 text-xs mb-4">Select amenities provided at the venue.</p>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                       {availableAmenities.map((item) => {
                         const isChecked = amenities.includes(item);
                         return (
                           <button
                             type="button"
                             key={item}
                             onClick={() => handleAmenityChange(item)}
                             className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 text-left ${isChecked
                                 ? 'bg-indigo-50 border-indigo-350 text-indigo-700 shadow-sm shadow-indigo-50'
                                 : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                               }`}
                           >
                             <span className={`w-4 h-4 flex items-center justify-center rounded-md border transition-all ${isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                               }`}>
                               {isChecked && (
                                 <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                 </svg>
                               )}
                             </span>
                             <span>{item}</span>
                           </button>
                         );
                       })}
                     </div>

                     {/* Add Custom Amenity Input */}
                     <div className="mt-4 flex items-center gap-2 max-w-sm">
                       <input
                         type="text"
                         placeholder="Add custom amenity (e.g. Swimming Pool)"
                         value={newAmenityInput}
                         onChange={(e) => setNewAmenityInput(e.target.value)}
                         className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1 h-[38px]"
                       />
                       <button
                         type="button"
                         onClick={handleAddCustomAmenity}
                         className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer h-[38px] flex items-center justify-center gap-1"
                       >
                         <span className="text-sm font-bold text-lg">+</span>
                       </button>
                     </div>                    </div>

                  {/* Review Section */}
                  <div className="border-t border-slate-200 pt-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-850">Review Venue Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venue Name</span>
                        <p className="text-sm font-bold text-slate-700">{name}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venue Type</span>
                        <p className="text-sm font-bold text-slate-700">{type}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Capacity</span>
                        <p className="text-sm font-bold text-slate-700">{capacity} people</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                        <p className="text-sm font-bold text-slate-700">{location}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking Modes Enabled</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {fixedSlots && <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase">Fixed Packages</span>}
                          {hourlyBooking && <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase">Hourly Booking</span>}
                          {customRequests && <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase">Custom Requests</span>}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Images Selected</span>
                        <p className="text-sm font-bold text-slate-700">{selectedImages.length} images</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amenities Selected</span>
                        <p className="text-sm font-bold text-slate-700">
                          {amenities.length > 0 ? amenities.join(', ') : 'None'}
                        </p>
                      </div>
                      {fixedSlots && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fixed Packages Count</span>
                          <p className="text-sm font-bold text-slate-700">
                            {Object.values(availability).reduce((acc, curr) => acc + (curr.isOpen ? curr.slots.length : 0), 0)} packages configured
                          </p>
                        </div>
                      )}
                      {hourlyBooking && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hourly Booking Configuration</span>
                          <p className="text-xs text-slate-650 font-bold mt-0.5">
                            ₹{pricePerHour}/hr • {hourlyStartTime} - {hourlyEndTime} • Min {hourlyMinHours}h, Max {hourlyMaxHours}h
                          </p>
                        </div>
                      )}
                      {customRequests && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Requests Configuration</span>
                          <p className="text-xs text-slate-655 font-bold mt-0.5">
                            {customOwnerApprovalRequired ? 'Manual Approval' : 'Auto Approval'} • Notice: {customMinNoticeHours} hours
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2.5 border border-slate-250 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  key="btn-next"
                  type="button"
                  disabled={!isStepValid(currentStep)}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition-all cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <button
                  key="btn-submit"
                  type="submit"
                  disabled={loading || !isStepValid(currentStep)}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 transition-all cursor-pointer"
                >
                  {loading ? 'Creating Venue...' : 'Create Venue'}
                </button>
              )}
            </div>

          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            BookMyVenue
          </p>
        </div>
      </footer>
    </div>
  );
}