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

export default function OwnerCreateVenuePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Conference Room');
  const [capacity, setCapacity] = useState<number>(10);
  const [location, setLocation] = useState('');
  const [pricePerHour, setPricePerHour] = useState<number>(50);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      // Use device-selected images first, then fallback to URL, then default image
      let imagesArray = [...selectedImages];
      // if (imagesArray.length === 0) {
      //   if (imageUrl.trim()) {
      //     imagesArray = imageUrl.split(',').map((url) => url.trim()).filter((url) => url !== '');
      //   } else {
      //     imagesArray = ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'];
      //   }
      // }

      await api.post('/venues', {
        name,
        type,
        capacity: Number(capacity),
        location,
        pricePerHour: Number(pricePerHour),
        images: imagesArray,
        description,
        amenities,
      });

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
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
        <div className="mb-6">
          <Link href="/owner/venues" className="text-indigo-600 hover:text-indigo-500 font-semibold text-sm flex items-center gap-1.5 transition-colors">
            &larr; Back to Venues
          </Link>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
          {/* Header text */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">List a New Venue</h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Enter all specifications, pricing details, and amenities to list your property.
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2 animate-bounce">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Venue created successfully! Redirecting...</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Venue Name */}
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

            {/* Row 2: Type & Capacity */}
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

            {/* Row 3: Location & Price per Hour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <label htmlFor="pricePerHour" className="block text-sm font-semibold text-slate-700">
                  Price Per Hour(RS)<span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  id="pricePerHour"
                  required
                  min="0"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(Number(e.target.value))}
                  placeholder="e.g. 120"
                  className="mt-1.5 block w-full px-4 py-3 border border-slate-250 rounded-xl shadow-sm placeholder-slate-400 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Row 4: Image Selection & URLs */}
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
                  <div className="flex text-sm text-slate-600 font-semibold justify-center">
                    <span className="text-indigo-600 hover:text-indigo-500">Upload files</span>
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

              {/* Advanced fallback: Image URL */}
              {/* <div className="pt-2 border-t border-slate-100">
                <label htmlFor="imageUrl" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Or provide image URLs (Alternative)
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. https://image1.com, https://image2.com"
                  className="mt-1.5 block w-full px-4 py-2 border border-slate-250 rounded-xl shadow-sm placeholder-slate-400 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs transition-all"
                />
              </div> */}
            </div>

            {/* Row 5: Description */}
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

            {/* Row 6: Amenities checkboxes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITY_OPTIONS.map((item) => {
                  const isChecked = amenities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleAmenityChange(item)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 text-left ${isChecked
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm shadow-indigo-50'
                          : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
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
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Submitting Listings...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} BookMyVenue. All rights reserved. Owner Portal Console.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">
              Landing Page
            </Link>
            <Link href="/owner/venues" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">
              Manage Venues
            </Link>
            <Link href="/owner/bookings" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">
              Manage Bookings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}