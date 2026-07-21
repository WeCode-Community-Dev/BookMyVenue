import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVenues } from "../services/venueService";
import VenueCard from "../../../components/VenueCard";

function VenueListPage() {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVenues = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVenues({ search, location });
      setVenues(data);
    } catch (err) {
      setError(err.message || "Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadVenues();
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <Link to="/" className="text-xs text-blue-600 hover:underline">
              ← Home
            </Link>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Browse Venues</h1>
            <p className="text-sm text-slate-400">Approved venues ready to book</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-rose-600 text-sm bg-rose-50 px-4 py-3 rounded-xl">{error}</p>}

        {!loading && !error && venues.length === 0 && (
          <p className="text-center text-slate-400 py-16">No venues found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default VenueListPage;
