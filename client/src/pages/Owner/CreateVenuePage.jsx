import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { venueService } from '../../services';
import toast from 'react-hot-toast';

export default function CreateVenuePage() {
  const [form, setForm] = useState({
    venueName: '',
    venueType: 'banquet_hall',
    description: '',
    address: '',
    latitude: 13.0827,
    longitude: 80.2707,
    capacity: 100,
    pricePerHour: 1000,
    amenities: 'AC, Parking, Sound System',
    images: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    openingTime: '09:00',
    closingTime: '22:00',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.venueName || !form.address || !form.pricePerHour) {
      return toast.error('Please fill required fields');
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        capacity: Number(form.capacity),
        pricePerHour: Number(form.pricePerHour),
        amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      };
      await venueService.create(payload);
      toast.success('Venue listing requested! It is currently pending admin approval.');
      navigate('/owner/dashboard');
    } catch {
      toast.error('Failed to create venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">List a Venue</h1>
        <p className="text-slate-400 text-sm mb-8">Add a new event venue space, conference room, or hall to BookMyVenue</p>

        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-white/8 flex flex-col gap-5 shadow-2xl">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Venue Name *</label>
            <input
              type="text"
              className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. Royal Banquet Hall"
              value={form.venueName}
              onChange={e => setForm({ ...form, venueName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Venue Type</label>
              <select
                className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                value={form.venueType}
                onChange={e => setForm({ ...form, venueType: e.target.value })}
              >
                <option value="banquet_hall" className="bg-bg-card">Banquet Hall</option>
                <option value="conference_room" className="bg-bg-card">Conference Room</option>
                <option value="resort_hotel" className="bg-bg-card">Resort/Hotel</option>
                <option value="meetup_space" className="bg-bg-card">Meetup Space</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price per Hour (₹) *</label>
              <input
                type="number"
                className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                placeholder="1000"
                value={form.pricePerHour}
                onChange={e => setForm({ ...form, pricePerHour: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address *</label>
            <input
              type="text"
              className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              placeholder="Full physical address..."
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latitude</label>
              <input
                type="number"
                step="0.0001"
                className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                value={form.latitude}
                onChange={e => setForm({ ...form, latitude: Number(e.target.value) })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Longitude</label>
              <input
                type="number"
                step="0.0001"
                className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                value={form.longitude}
                onChange={e => setForm({ ...form, longitude: Number(e.target.value) })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity</label>
              <input
                type="number"
                className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
                value={form.capacity}
                onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <textarea
              className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary h-24 resize-none"
              placeholder="Tell guests about your space amenities, layouts..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amenities (comma-separated)</label>
            <input
              type="text"
              className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. AC, Parking, WiFi, Sound System"
              value={form.amenities}
              onChange={e => setForm({ ...form, amenities: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image URLs (comma-separated)</label>
            <input
              type="text"
              className="w-full py-3 px-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. https://images.unsplash.com/..."
              value={form.images}
              onChange={e => setForm({ ...form, images: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 font-bold rounded-xl bg-gradient-to-r from-primary to-primary-light hover:brightness-110 active:scale-[0.98] text-white shadow-lg transition-transform"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Venue Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
