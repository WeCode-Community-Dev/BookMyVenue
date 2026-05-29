import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdSearch, MdLocationOn, MdStar, MdGroups, MdEventSeat } from 'react-icons/md';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/venues?search=${search.trim()}`);
    }
  };

  const categories = [
    { name: 'Banquet Halls', type: 'banquet_hall', icon: '🏢', count: '12 spaces' },
    { name: 'Conference Rooms', type: 'conference_room', icon: '💻', count: '8 spaces' },
    { name: 'Resorts & Hotels', type: 'resort_hotel', icon: '🏖️', count: '15 spaces' },
    { name: 'Meetup Spaces', type: 'meetup_space', icon: '👥', count: '6 spaces' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary pt-28 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mt-16 mb-20">
          <span className="px-3.5 py-1 text-xs font-semibold tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 inline-block">
            Location-Based Venue Discovery & Instant Booking
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            Find the perfect space for your next event
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl mx-auto font-medium leading-relaxed">
            Discover nearby banquet halls, meeting rooms, resorts, hotels, and meetup spaces with atomic booking locks and calendar availability.
          </p>

          {/* Clean Flat Light Search Bar */}
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-2 shadow-lg">
            <div className="flex-1 relative flex items-center">
              <MdSearch className="absolute left-4 text-xl text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
                placeholder="Search by city, area or venue name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 font-bold rounded-xl bg-primary hover:bg-primary-dark text-white text-sm transition-all duration-200 shadow-sm shadow-primary/20"
            >
              Search Space
            </button>
          </form>
        </div>

        {/* Feature Cards Grid (Matte Elevation) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="matte-card p-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl mb-6">
              <MdLocationOn />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Nearby Discovery</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Find local, verified spaces sorted by coordinates, distances, and seating layouts.
            </p>
          </div>

          <div className="matte-card p-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl mb-6">
              <MdStar />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Conflict Prevention</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Acquire a 5-minute atomic lock on your slot to finish your booking details securely.
            </p>
          </div>

          <div className="matte-card p-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl mb-6">
              <MdGroups />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Curated Spaces</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Vetted banquet halls, wedding spots, private resorts, and business meeting rooms.
            </p>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-10 text-center">
            Explore venues by category
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/venues?venueType=${cat.type}`}
                className="matte-card p-6 text-center hover:scale-[1.01]"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{cat.name}</h4>
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Host banner with clean flat border and background */}
        <div className="matte-card p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Own a venue or event space?</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              List your properties, manage availability calendars, prevent duplicate locking conflicts, and dynamically track earnings with our real-time host console.
            </p>
          </div>
          <Link to="/register?role=venue_owner" className="py-3 px-6 whitespace-nowrap font-bold rounded-xl bg-primary hover:bg-primary-dark text-white text-sm transition-all shadow-sm shadow-primary/10">
            Start Hosting Today
          </Link>
        </div>
      </div>
    </div>
  );
}
