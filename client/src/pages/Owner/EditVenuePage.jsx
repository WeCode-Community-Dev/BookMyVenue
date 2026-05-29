import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { venueService } from '../../services';
import toast from 'react-hot-toast';

export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    venueName: '',
    venueType: 'banquet_hall',
    description: '',
    address: '',
    latitude: 13.0827,
    longitude: 80.2707,
    capacity: 100,
    pricePerHour: 1000,
  });

  const [selectedAmenities, setSelectedAmenities] = useState({
    ac: false,
    nonAc: false,
    parking: false,
    soundSystem: false,
    powerBackup: false,
    wifi: false,
    catering: false,
  });

  // Operational schedule with custom daily times
  const [selectedDays, setSelectedDays] = useState({
    monday: { active: false, start: '09:00', end: '22:00' },
    tuesday: { active: false, start: '09:00', end: '22:00' },
    wednesday: { active: false, start: '09:00', end: '22:00' },
    thursday: { active: false, start: '09:00', end: '22:00' },
    friday: { active: false, start: '09:00', end: '22:00' },
    saturday: { active: false, start: '10:00', end: '23:00' },
    sunday: { active: false, start: '10:00', end: '21:00' },
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [customLocationFallback, setCustomLocationFallback] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchingNetwork, setSearchingNetwork] = useState(false);
  
  // Map and Leaflet integration states
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Preset default location recommendations when input is empty
  const locationPresets = [
    { name: 'Kaloor, Kochi, Kerala', lat: 9.9880, lng: 76.3023, address: 'Kaloor Junction, Kochi, Kerala, 682017' },
    { name: 'Connaught Place, New Delhi', lat: 28.6304, lng: 77.2177, address: 'Radial Rd 1, Connaught Place, New Delhi, Delhi 110001' },
    { name: 'Nungambakkam, Chennai, Tamil Nadu', lat: 13.0604, lng: 80.2376, address: 'Nungambakkam High Road, Chennai, Tamil Nadu, 600034' },
    { name: 'Indiranagar, Bengaluru, Karnataka', lat: 12.9719, lng: 77.6412, address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka, 560038' },
    { name: 'Bandra West, Mumbai, Maharashtra', lat: 19.0607, lng: 72.8362, address: 'Linking Road, Bandra West, Mumbai, Maharashtra, 400050' },
  ];

  const [searchResults, setSearchResults] = useState(locationPresets);

  // Load Leaflet dynamically on mount
  useEffect(() => {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  // Fetch existing space details on mount
  useEffect(() => {
    if (!id) return;
    
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        const res = await venueService.getById(id);
        const venue = res.data;

        setForm({
          venueName: venue.venueName || '',
          venueType: venue.venueType || 'banquet_hall',
          description: venue.description || '',
          address: venue.address || '',
          latitude: Number(venue.latitude) || 13.0827,
          longitude: Number(venue.longitude) || 80.2707,
          capacity: Number(venue.capacity) || 100,
          pricePerHour: Number(venue.pricePerHour) || 1000,
        });

        setLocationSearch(venue.address ? venue.address.split(',')[0] : '');

        // Map Amenities Checklist Checkboxes
        if (Array.isArray(venue.amenities)) {
          const amObj = {
            ac: venue.amenities.includes('AC'),
            nonAc: venue.amenities.includes('Non-AC'),
            parking: venue.amenities.includes('Parking Space'),
            soundSystem: venue.amenities.includes('Sound System'),
            powerBackup: venue.amenities.includes('Power Backup'),
            wifi: venue.amenities.includes('WiFi'),
            catering: venue.amenities.includes('Catering Service') || venue.amenities.includes('Catering'),
          };
          setSelectedAmenities(amObj);
        }

        // Map Daily operational schedules
        if (Array.isArray(venue.workingDays)) {
          const daysObj = {
            monday: { active: false, start: '09:00', end: '22:00' },
            tuesday: { active: false, start: '09:00', end: '22:00' },
            wednesday: { active: false, start: '09:00', end: '22:00' },
            thursday: { active: false, start: '09:00', end: '22:00' },
            friday: { active: false, start: '09:00', end: '22:00' },
            saturday: { active: false, start: '10:00', end: '23:00' },
            sunday: { active: false, start: '10:00', end: '21:00' },
          };

          venue.workingDays.forEach(cfg => {
            if (cfg && cfg.day && daysObj[cfg.day.toLowerCase()]) {
              daysObj[cfg.day.toLowerCase()] = {
                active: true,
                start: cfg.start || '09:00',
                end: cfg.end || '22:00'
              };
            }
          });
          setSelectedDays(daysObj);
        }

        setUploadedImages(venue.images || []);
      } catch (err) {
        toast.error('Failed to load venue details');
        navigate('/owner/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [id, navigate]);

  // Update or Initialize Leaflet map
  useEffect(() => {
    if (loading || !leafletLoaded || !window.L) return;

    const lat = Number(form.latitude);
    const lng = Number(form.longitude);

    if (mapRef.current) {
      // Map already exists, update view and marker
      mapRef.current.setView([lat, lng], 13);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = window.L.marker([lat, lng]).addTo(mapRef.current);
      }
      return;
    }

    // Initialize Map
    mapRef.current = window.L.map('venue-leaflet-map').setView([lat, lng], 13);
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Create marker
    markerRef.current = window.L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);

    // Marker drag event
    markerRef.current.on('dragend', () => {
      const position = markerRef.current.getLatLng();
      setForm(prev => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng,
        address: prev.address || `Pin-drop Location (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})`
      }));
    });

    // Map click event to reloc marker
    mapRef.current.on('click', (e) => {
      const position = e.latlng;
      setForm(prev => ({
        ...prev,
        latitude: position.lat,
        longitude: position.lng,
        address: prev.address || `Selected Location (${position.lat.toFixed(4)}, ${position.lng.toFixed(4)})`
      }));
      markerRef.current.setLatLng(position);
    });

  }, [loading, leafletLoaded, form.latitude, form.longitude]);

  // Handle Preset or dynamic select
  const handleSelectPreset = (preset) => {
    setForm(prev => ({
      ...prev,
      address: preset.address,
      latitude: preset.lat,
      longitude: preset.lng,
    }));
    setLocationSearch(preset.name);
    setShowLocationDropdown(false);
    setCustomLocationFallback(false);
  };

  // Dynamic network geocoder using backend proxy API to prevent browser CORS/Rate-limit blocking
  const handleCustomLocationChange = async (val) => {
    setLocationSearch(val);
    setShowLocationDropdown(true);

    if (val.trim().length >= 3) {
      setSearchingNetwork(true);
      try {
        const response = await venueService.geocode(val);
        const data = response.data;
        
        if (data && data.length > 0) {
          const results = data.map(item => {
            const parts = item.display_name.split(',');
            const shortName = parts[0] + (parts[1] ? ', ' + parts[1].trim() : '') + (parts[2] ? ', ' + parts[2].trim() : '');
            return {
              name: shortName,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              address: item.display_name,
            };
          });
          setSearchResults(results);
          setCustomLocationFallback(false);
        } else {
          // No results from search
          setSearchResults([]);
          setCustomLocationFallback(true);
        }
      } catch (err) {
        // Fallback filter locally
        const localMatches = locationPresets.filter(preset =>
          preset.name.toLowerCase().includes(val.toLowerCase())
        );
        setSearchResults(localMatches);
      } finally {
        setSearchingNetwork(false);
      }
    } else {
      // Empty or short query shows local defaults
      const localMatches = locationPresets.filter(preset =>
        preset.name.toLowerCase().includes(val.toLowerCase())
      );
      setSearchResults(localMatches.length > 0 ? localMatches : locationPresets);
      setCustomLocationFallback(false);
    }
  };

  // Image Upload and Canvas Compression
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        return toast.error('Only image files are supported');
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Dynamic compression using HTML Canvas
          const canvas = document.createElement('canvas');
          const maxDimension = 1200; // max size in px
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to highly optimized JPEG Base64 (0.75 quality is extremely clear yet small!)
          const base64Data = canvas.toDataURL('image/jpeg', 0.75);
          setUploadedImages(prev => [...prev, base64Data]);
          toast.success(`Image "${file.name}" uploaded successfully!`);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    toast.success('Image removed from listing');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.venueName || !form.address || !form.pricePerHour) {
      return toast.error('Please fill required fields');
    }

    if (uploadedImages.length === 0) {
      return toast.error('Please upload at least one image for your venue!');
    }

    // Process amenities checkboxes
    const amenities = Object.entries(selectedAmenities)
      .filter(([_, checked]) => checked)
      .map(([key]) => {
        if (key === 'ac') return 'AC';
        if (key === 'nonAc') return 'Non-AC';
        if (key === 'parking') return 'Parking Space';
        if (key === 'soundSystem') return 'Sound System';
        if (key === 'powerBackup') return 'Power Backup';
        if (key === 'wifi') return 'WiFi';
        if (key === 'catering') return 'Catering Service';
        return key;
      });

    // Map daily operational timings into the JSONB array
    const workingDays = Object.entries(selectedDays)
      .filter(([_, conf]) => conf.active)
      .map(([day, conf]) => ({
        day,
        start: conf.start,
        end: conf.end,
      }));

    setSaving(true);
    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        capacity: Number(form.capacity),
        pricePerHour: Number(form.pricePerHour),
        amenities,
        workingDays,
        images: uploadedImages,
      };

      await venueService.update(id, payload);
      toast.success('Venue listing updated successfully!');
      navigate('/owner/dashboard?tab=venues');
    } catch {
      toast.error('Failed to update venue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-28">
        <div className="flex flex-col items-center gap-3">
          <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading Listing details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Edit Venue listing</h1>
            <p className="text-slate-500 text-sm">Update property settings, operational schedules, pricing, and locations.</p>
          </div>
          <button
            onClick={() => navigate('/owner/dashboard?tab=venues')}
            className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 flex flex-col gap-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)]">
          {/* Venue Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Name *</label>
            <input
              type="text"
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
              placeholder="e.g. Royal Banquet Hall"
              value={form.venueName}
              onChange={e => setForm({ ...form, venueName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Venue Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Type</label>
              <select
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                value={form.venueType}
                onChange={e => setForm({ ...form, venueType: e.target.value })}
              >
                <option value="banquet_hall">Banquet Hall</option>
                <option value="conference_room">Conference Room</option>
                <option value="resort_hotel">Resort/Hotel</option>
                <option value="meetup_space">Meetup Space</option>
                <option value="birthday_hall">Birthday Hall</option>
                <option value="auditorium">Auditorium</option>
                <option value="cafe">Cafe / Resto</option>
                <option value="outdoor_space">Outdoor Space</option>
              </select>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price per Hour (₹) *</label>
              <input
                type="number"
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="1000"
                value={form.pricePerHour}
                onChange={e => setForm({ ...form, pricePerHour: Number(e.target.value) })}
                required
                min="0"
              />
            </div>
          </div>

          {/* Location / Google Map Search */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Location (Google Map Integration) *</label>
            <div className="relative">
              <input
                type="text"
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="Search address, city, or area (e.g. Royal Palace, Kochi)..."
                value={locationSearch}
                onChange={e => handleCustomLocationChange(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
              />
              {searchingNetwork && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <span className="w-4.5 h-4.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showLocationDropdown && (
              <div className="absolute top-[75px] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 max-h-64 overflow-y-auto">
                <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {locationSearch.trim().length >= 3 ? '🔍 Live Results' : '⭐ Suggested Recommendations'}
                </div>
                {searchResults.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors flex flex-col"
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <span className="font-bold text-slate-900">{preset.name}</span>
                    <span className="text-xs text-slate-500 line-clamp-1">{preset.address}</span>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <div className="px-4 py-4 text-xs text-slate-500 text-center font-medium">
                    No matching places found. Try a different location search query or click directly on the map.
                  </div>
                )}
              </div>
            )}

            {/* Live Interactive Map Box */}
            <div className="mt-2 flex flex-col gap-1">
              <div id="venue-leaflet-map" className="w-full h-64 rounded-xl border border-slate-200 z-10" />
              <span className="text-[10px] text-slate-400 italic">
                💡 Live Map Active! Click or drag the marker anywhere on the map above to select your custom coordinates.
              </span>
            </div>

            {/* Fallback notification box */}
            {customLocationFallback && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 flex flex-col gap-1">
                <span className="font-bold">📍 Custom Geolocation:</span>
                <span>Coordinates center pin resolved. You can also click directly on the map to pin your exact entrance location!</span>
              </div>
            )}
          </div>

          {/* Full Address Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Address (Textarea) *</label>
            <textarea
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary focus:bg-white h-24 resize-none transition-all duration-200"
              placeholder="Full physical street address details..."
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Capacity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Seating Capacity</label>
              <input
                type="number"
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                value={form.capacity}
                onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
                min="1"
              />
            </div>

            {/* Coordinates Display (Read-Only) */}
            <div className="flex grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latitude</label>
                <input
                  type="text"
                  disabled
                  className="w-full py-3 px-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-xs cursor-not-allowed"
                  value={Number(form.latitude).toFixed(5)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Longitude</label>
                <input
                  type="text"
                  disabled
                  className="w-full py-3 px-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-xs cursor-not-allowed"
                  value={Number(form.longitude).toFixed(5)}
                />
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Overview / Description</label>
            <textarea
              className="w-full py-3 px-4 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-primary focus:bg-white h-28 resize-none transition-all duration-200"
              placeholder="Provide a stunning layout, rules, pricing details, and facilities summary..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Amenities Checklist checkboxes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Amenities Checklist</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.keys(selectedAmenities).map((key) => {
                const label = key === 'ac' ? 'AC' :
                              key === 'nonAc' ? 'Non-AC' :
                              key === 'parking' ? 'Parking Space' :
                              key === 'soundSystem' ? 'Sound System' :
                              key === 'powerBackup' ? 'Power Backup' :
                              key === 'wifi' ? 'WiFi' : 'Catering';
                return (
                  <label key={key} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 hover:border-slate-200/85 hover:bg-slate-50/50 cursor-pointer select-none transition-colors">
                    <input
                      type="checkbox"
                      className="accent-primary w-4.5 h-4.5 rounded cursor-pointer"
                      checked={selectedAmenities[key]}
                      onChange={e => setSelectedAmenities(prev => ({ ...prev, [key]: e.target.checked }))}
                    />
                    <span className="text-sm font-semibold text-slate-700">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Working Days Checkboxes with times */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Working Days (Operational schedule)</label>
            <div className="flex flex-col gap-3.5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              {Object.keys(selectedDays).map((day) => {
                const capitalized = day.charAt(0).toUpperCase() + day.slice(1);
                const dayConfig = selectedDays[day];
                return (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/40 last:border-0 last:pb-0">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="accent-primary w-4.5 h-4.5 rounded cursor-pointer"
                        checked={dayConfig.active}
                        onChange={e => setSelectedDays(prev => ({
                          ...prev,
                          [day]: { ...prev[day], active: e.target.checked }
                        }))}
                      />
                      <span className="text-sm font-bold text-slate-800">{capitalized}</span>
                    </label>

                    {dayConfig.active && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Timings:</span>
                        <input
                          type="time"
                          className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-primary"
                          value={dayConfig.start}
                          onChange={e => setSelectedDays(prev => ({
                            ...prev,
                            [day]: { ...prev[day], start: e.target.value }
                          }))}
                        />
                        <span className="text-xs text-slate-400">to</span>
                        <input
                          type="time"
                          className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-primary"
                          value={dayConfig.end}
                          onChange={e => setSelectedDays(prev => ({
                            ...prev,
                            [day]: { ...prev[day], end: e.target.value }
                          }))}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Image Uploader Area */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Images *</label>
            
            {/* Drag & Drop card */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 hover:border-primary/60 hover:bg-slate-50/50 rounded-2xl cursor-pointer select-none transition-all duration-200 group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-1 text-sm text-slate-700 font-bold">Click or Drag to Upload Images</p>
                <p className="text-xs text-slate-400">PNG, JPG, or JPEG (Automatic high-fidelity uploader active!)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Gallery Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-2">
              {uploadedImages.map((image, idx) => (
                <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img
                    src={image}
                    alt={`Venue upload ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Delete overlay */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-500/90 hover:bg-rose-600 rounded-lg text-white opacity-95 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-md"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 text-[10px] font-bold text-white rounded">
                    {idx === 0 ? 'Featured' : `Image ${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 mt-2 font-bold rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.99] text-white shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            disabled={saving}
          >
            {saving ? 'Saving changes...' : 'Save Venue Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
