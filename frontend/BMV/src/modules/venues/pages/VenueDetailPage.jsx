import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getVenueById } from "../services/venueService";
import BookingForm from "../../../components/BookingForm";

function VenueDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVenue = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getVenueById(id);
        setVenue(data);
      } catch (err) {
        setError(err.message || "Venue not found");
      } finally {
        setLoading(false);
      }
    };
    loadVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] p-6 text-center">
        <p className="text-rose-600">{error || "Venue not found"}</p>
        <Link to="/venues" className="text-sm text-blue-600 mt-2 inline-block">
          Back to venues
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Link to="/venues" className="text-sm text-blue-600 hover:underline">
          ← Back to venues
        </Link>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {venue.image_url ? (
              <img src={venue.image_url} alt={venue.name} className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 bg-slate-100 flex items-center justify-center text-slate-400">
                No image
              </div>
            )}
            <div className="p-6 space-y-3">
              <h1 className="text-2xl font-bold text-slate-800">{venue.name}</h1>
              <p className="text-slate-500">{venue.location}</p>
              {venue.venue_type && (
                <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  {venue.venue_type.name}
                </span>
              )}
              <p className="text-2xl font-bold text-slate-800">
                ₹{Number(venue.price_per_day).toLocaleString("en-IN")}
                <span className="text-sm font-normal text-slate-400"> /day</span>
              </p>
              {venue.capacity && (
                <p className="text-sm text-slate-500">Capacity: {venue.capacity} guests</p>
              )}
              {venue.description && (
                <p className="text-sm text-slate-600 leading-relaxed">{venue.description}</p>
              )}
              {venue.amenities?.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((a) => (
                      <span
                        key={a.id}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            {isAuthenticated ? (
              <BookingForm venueId={venue.id} pricePerDay={venue.price_per_day} />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
                <p className="text-slate-600 mb-4">Sign in to book this venue</p>
                <Link
                  to="/login"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium"
                >
                  Login to book
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueDetailPage;
