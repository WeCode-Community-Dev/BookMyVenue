import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchVenueByIdAsync, fetchPublicVenuesAsync, clearSelectedVenue } from "../modules/venues/venuesSlice";
import { createBookingAsync } from "../modules/bookings/bookingSlice";
import { venueService } from "../modules/venues/services/venueService";
import Footer from "../components/Footer";

// ─── Icons ───────────────────────────────────────────────────────────────────

function StarIcon({ filled = true, className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UsersIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CalendarIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

// ─── Amenity icon map ────────────────────────────────────────────────────────

function AmenityIcon({ name }) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("parking")) return <span className="text-base">🅿️</span>;
  if (lower.includes("wifi") || lower.includes("wi-fi")) return <span className="text-base">📶</span>;
  if (lower.includes("catering") || lower.includes("food")) return <span className="text-base">🍽️</span>;
  if (lower.includes("audio") || lower.includes("sound")) return <span className="text-base">🎵</span>;
  if (lower.includes("climate") || lower.includes("ac") || lower.includes("hvac")) return <span className="text-base">❄️</span>;
  if (lower.includes("pool") || lower.includes("swim")) return <span className="text-base">🏊</span>;
  if (lower.includes("stage") || lower.includes("theatre")) return <span className="text-base">🎭</span>;
  if (lower.includes("projector") || lower.includes("screen")) return <span className="text-base">📽️</span>;
  return <span className="text-base">✨</span>;
}

// ─── Availability checker + booking widget ───────────────────────────────────

function AvailabilityChecker({ venueId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: bookingLoading, error: bookingError } = useSelector((state) => state.bookings);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [result, setResult] = useState(null); // true | false | null
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState(null);

  // Extra booking fields shown after availability is confirmed
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [notes, setNotes] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleCheck = async () => {
    if (!date || !timeSlot) return;
    setChecking(true);
    setResult(null);
    setCheckError(null);
    try {
      const data = await venueService.checkAvailability(venueId, date, timeSlot);
      setResult(data.available);
    } catch {
      setCheckError("Could not check availability. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      // Remember where to come back to after login
      navigate(`/login?next=/venues/${venueId}`);
      return;
    }

    if (!date || !timeSlot) return;

    // Generate a simple idempotency key for this request attempt
    const idempotencyKey = `${venueId}-${date}-${timeSlot}-${Date.now()}`;

    const resultAction = await dispatch(
      createBookingAsync({
        venue_id: venueId,
        booking_date: date,
        time_slot: timeSlot,
        event_type: eventType || undefined,
        guest_count: guestCount ? Number(guestCount) : undefined,
        notes: notes || undefined,
        idempotencyKey,
      }),
    );

    if (createBookingAsync.fulfilled.match(resultAction)) {
      navigate(`/booking-confirmed/${resultAction.payload.id}`);
    }
  };

  return (
    <>
      {/* Date */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Date
        </label>
        <div className="relative">
          <input
            type="date"
            min={todayStr}
            value={date}
            onChange={(e) => { setDate(e.target.value); setResult(null); }}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Time */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Time Slot
        </label>
        <div className="relative">
          <select
            value={timeSlot}
            onChange={(e) => { setTimeSlot(e.target.value); setResult(null); }}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 appearance-none bg-white transition-all"
          >
            <option value="">Select a time</option>
            {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
              "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Availability result */}
      {result !== null && (
        <div className={`mb-4 px-3 py-2.5 rounded-xl text-sm font-medium ${
          result
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {result ? "✓ Available on this date & time" : "✗ Not available — try another slot"}
        </div>
      )}
      {checkError && (
        <div className="mb-4 px-3 py-2.5 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">
          {checkError}
        </div>
      )}

      {/* Extra fields — only shown once slot is confirmed available */}
      {result === true && (
        <div className="mb-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Event Type <span className="text-slate-300 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g. Wedding, Corporate Event"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Expected Guests <span className="text-slate-300 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="e.g. 150"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Notes <span className="text-slate-300 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any special requirements..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
            />
          </div>
        </div>
      )}

      {/* Booking error from Redux */}
      {bookingError && (
        <div className="mb-3 px-3 py-2.5 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">
          {bookingError}
        </div>
      )}

      {/* Check availability button */}
      <button
        onClick={handleCheck}
        disabled={!date || !timeSlot || checking}
        className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3 rounded-xl text-sm font-semibold transition-colors mb-2.5 flex items-center justify-center gap-2"
      >
        {checking ? "Checking..." : <>Check Availability <ArrowRightIcon className="w-3.5 h-3.5" /></>}
      </button>

      {/* Request to Book — enabled only when slot is available */}
      <button
        onClick={handleBook}
        disabled={result !== true || bookingLoading}
        className="w-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 hover:text-rose-700 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {bookingLoading
          ? <><span className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" /> Sending request…</>
          : "Request to Book"
        }
      </button>

      <p className="text-center text-xs text-slate-400 mt-3">
        {isAuthenticated
          ? result === true
            ? "Confirm availability first, then send your request."
            : "Check availability to enable booking."
          : "Sign in to book this venue."
        }
      </p>
    </>
  );
}

// ─── Similar Venue Card ──────────────────────────────────────────────────────

function SimilarVenueCard({ venue }) {
  return (
    <Link
      to={`/venues/${venue.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg hover:border-rose-100 transition-all"
    >
      <div className="relative overflow-hidden">
        {venue.image_url ? (
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
            No image
          </div>
        )}
        {venue.average_rating && (
          <div className="absolute top-3 left-3 bg-white/95 rounded-lg px-2 py-1 flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-semibold text-slate-800">{Number(venue.average_rating).toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-bold text-slate-800 text-sm">{venue.name}</h4>
        <div className="flex items-center gap-1 mt-1 text-slate-400">
          <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs truncate">{venue.location}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          <span className="text-sm font-bold text-slate-900">
            ₹{Number(venue.price_per_day).toLocaleString("en-IN")}
            <span className="text-xs font-normal text-slate-400">/day</span>
          </span>
          <span className="text-rose-600 text-xs font-medium flex items-center gap-1">
            View <ArrowRightIcon className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function VenueDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: venue, isLoadingSelected, selectedError, list } = useSelector((state) => state.venues);

  const similarVenues = list
    .filter((v) => v.id !== Number(id))
    .slice(0, 3);

  useEffect(() => {
    dispatch(fetchVenueByIdAsync(Number(id)));
    if (list.length === 0) {
      dispatch(fetchPublicVenuesAsync({ limit: 20 }));
    }
    return () => {
      dispatch(clearSelectedVenue());
    };
  }, [id, dispatch]);

  if (isLoadingSelected) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading venue...</p>
        </div>
      </div>
    );
  }

  if (selectedError || !venue) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-700 font-semibold">Venue not found</p>
          <Link to="/venues" className="text-sm text-rose-600 hover:underline mt-2 inline-block">
            ← Back to venues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3.5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">BMV</div>
            <span className="font-bold text-slate-800 text-lg hidden sm:inline">BookMyVenue</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-rose-600">Home</Link>
            <Link to="/venues" className="hover:text-rose-600">Venues</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-slate-600 hover:text-rose-600 px-3 py-1.5">Login</Link>
            <Link to="/register" className="bg-rose-600 hover:bg-rose-700 text-white text-sm px-4 py-2 rounded-xl font-medium">Sign Up</Link>
          </div>
        </div>
      </header>

      <div className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link to="/" className="hover:text-rose-600">Home</Link>
          <span>/</span>
          <Link to="/venues" className="hover:text-rose-600">Venues</Link>
          <span>/</span>
          <span className="text-slate-600">{venue.name}</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{venue.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {venue.average_rating && (
                <div className="flex items-center gap-1.5">
                  <StarIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-800">{Number(venue.average_rating).toFixed(1)}</span>
                  {venue.total_reviews > 0 && (
                    <span className="text-xs text-slate-400">({venue.total_reviews} Reviews)</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1 text-slate-500">
                <MapPinIcon className="w-3.5 h-3.5" />
                <span className="text-sm">{venue.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-2 rounded-2xl overflow-hidden mb-8 h-72 md:h-96">
          <div className="col-span-2 row-span-2">
            {venue.image_url ? (
              <img src={venue.image_url} alt={venue.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                No image available
              </div>
            )}
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 flex items-center justify-center text-slate-300 text-xs relative overflow-hidden">
              {venue.image_url ? (
                <img src={venue.image_url} alt="" className="w-full h-full object-cover opacity-70" />
              ) : (
                <span>Photo {i + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* Main content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-rose-700 mb-4">About the Venue</h2>
              {venue.description ? (
                <p className="text-slate-600 text-sm leading-relaxed">{venue.description}</p>
              ) : (
                <p className="text-slate-400 text-sm italic">No description provided for this venue.</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                {venue.capacity && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <UsersIcon className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{venue.capacity} Guests Capacity</span>
                  </div>
                )}
                {venue.venue_type && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-rose-500 shrink-0">🏛️</span>
                    <span>{venue.venue_type.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarIcon className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Daily Booking</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {venue.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-rose-700 mb-5">What this venue offers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {venue.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                        <AmenityIcon name={amenity.name} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{amenity.name}</p>
                        {amenity.description && (
                          <p className="text-xs text-slate-400 mt-0.5">{amenity.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-rose-700">What Guests Say</h2>
                {venue.average_rating && (
                  <div className="flex items-center gap-1.5">
                    <StarIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-slate-800">{Number(venue.average_rating).toFixed(1)}</span>
                    <span className="text-xs text-slate-400">Global Rating</span>
                  </div>
                )}
              </div>
              {venue.total_reviews === 0 ? (
                <div className="text-center py-8">
                  <div className="flex justify-center gap-0.5 mb-3">
                    {[1,2,3,4,5].map(i => <StarIcon key={i} filled={false} className="w-6 h-6 text-slate-200" />)}
                  </div>
                  <p className="text-slate-400 text-sm">No reviews yet. Book this venue and be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500">
                    {venue.total_reviews} review{venue.total_reviews !== 1 ? "s" : ""} from verified guests.
                  </p>
                  <Link to={`/venues/${venue.id}`} className="text-sm text-rose-600 font-medium hover:underline flex items-center gap-1">
                    Show all {venue.total_reviews} reviews <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar — booking widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sticky top-24">
              <div className="mb-5 pb-4 border-b border-slate-50">
                <div className="flex items-baseline gap-2 justify-between">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{Number(venue.price_per_day).toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-slate-400"> /day</span>
                  </div>
                  {venue.venue_type && (
                    <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-1 rounded-lg font-semibold uppercase tracking-wide">
                      {venue.venue_type.name}
                    </span>
                  )}
                </div>
              </div>
              <AvailabilityChecker venueId={venue.id} />
            </div>
          </div>
        </div>

        {/* Similar Venues */}
        {similarVenues.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Similar Venues You'll Love</h2>
                <p className="text-sm text-slate-400 mt-1">More great spaces for your event</p>
              </div>
              <Link to="/venues" className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium">
                View all <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similarVenues.map((v) => (
                <SimilarVenueCard key={v.id} venue={v} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default VenueDetailPage;