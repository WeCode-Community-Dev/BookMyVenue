import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPublicVenuesAsync } from "../modules/venues/venuesSlice";
import { reviewService } from "../modules/reviews/services/reviewService";
import { logoutUserAsync } from "../modules/auth/authSlice";
import Footer from "../components/Footer";

// ─── Icons ─────────────────────────────────────────────────────────────────

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

function UsersIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
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

// ─── Sub-components ─────────────────────────────────────────────────────────

function FeaturedVenueCard({ venue }) {
  return (
    <Link
      to={`/venues/${venue.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-rose-100 transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        {venue.image_url ? (
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">No image</span>
          </div>
        )}
        {venue.average_rating && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <StarIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-800">
              {Number(venue.average_rating).toFixed(1)}
            </span>
          </div>
        )}
        {venue.venue_type && (
          <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-semibold px-2 py-1 rounded-lg uppercase tracking-wide">
            {venue.venue_type.name}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-800 text-base leading-tight">{venue.name}</h3>
        <div className="flex items-center gap-1 mt-1.5 text-slate-400">
          <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs truncate">{venue.location}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          <div>
            <span className="text-lg font-bold text-slate-900">
              ₹{Number(venue.price_per_day).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-400"> /day</span>
          </div>
          {venue.capacity && (
            <div className="flex items-center gap-1 text-slate-400">
              <UsersIcon className="w-3.5 h-3.5" />
              <span className="text-xs">{venue.capacity} guests</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function StarRating({ rating, className = "" }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          filled={i <= rating}
          className={`w-4 h-4 ${i <= rating ? "text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = review.reviewer_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
      <StarRating rating={review.rating} />
      <p className="text-slate-600 text-sm leading-relaxed italic">
        "{review.comment}"
      </p>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50">
        <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{review.reviewer_name}</p>
          <p className="text-xs text-slate-400">
            {review.event_type ? `${review.event_type} · ` : ""}
            {review.venue_name}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STATS = [
  { value: "1,000+", label: "Verified Venues" },
  { value: "25K+", label: "Happy Customers" },
  { value: "5,000+", label: "Successful Bookings" },
  { value: "4.8★", label: "Average Rating" },
];

const HOW_IT_WORKS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Search",
    text: "Find the perfect venue based on your needs, location, and budget.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Check",
    text: "Check availability & view detailed amenities before deciding.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    ),
    title: "Book",
    text: "Send your booking request and secure the date instantly.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Celebrate",
    text: "Confirm and enjoy your stress-free event.",
  },
];

const WHY_FEATURES = [
  {
    icon: "✓",
    title: "Verified & Trusted",
    text: "Every single venue on our platform undergoes rigorous quality checks.",
  },
  {
    icon: "₹",
    title: "Best Price Guarantee",
    text: "Find the venue at the cheapest price offered. We match any lower instance instantly.",
  },
  {
    icon: "📍",
    title: "Easy & Secure Booking",
    text: "Safe, seamless payment process with instant confirmation of your booking.",
  },
  {
    icon: "💬",
    title: "24/7 Customer Support",
    text: "Our dedicated concierge team is always available to assist with your plans.",
  },
  {
    icon: "0",
    title: "No Hidden Charges",
    text: "Transparency is our core value. What you see is exactly what you pay.",
  },
  {
    icon: "🔔",
    title: "Instant Notifications",
    text: "Get real-time updates on your booking status via SMS and email.",
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { list: venues, isLoadingList } = useSelector((state) => state.venues);
  const isOwner = user?.is_venue_owner;
  const isAdmin = user?.role === "admin";

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchPublicVenuesAsync({ limit: 4 }));
  }, [dispatch]);

  useEffect(() => {
    reviewService
      .fetchPublicReviews(6)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    navigate("/");
  };

  const handleListVenue = () => {
    if (!isAuthenticated) {
      navigate("/register-venue-owner");
    } else if (isOwner) {
      navigate("/owner/venues");
    } else {
      navigate("/register-venue-owner");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3.5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-rose-200">
              BMV
            </div>
            <span className="font-bold text-slate-800 text-lg hidden sm:inline">BookMyVenue</span>
          </Link>

          {/* ── Navbar: removed Categories and About Us ── */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-rose-600 transition-colors font-medium">Home</Link>
            <Link to="/venues" className="hover:text-rose-600 transition-colors">Venues</Link>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isOwner ? (
                  <Link to="/owner/dashboard" className="text-sm text-slate-600 hover:text-rose-600 hidden sm:inline px-3 py-1.5">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-sm text-slate-600 hover:text-rose-600 hidden sm:inline px-3 py-1.5">
                    Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="text-sm text-slate-600 hover:text-rose-600 hidden sm:inline px-3 py-1.5">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors shadow-sm shadow-rose-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-600 hover:text-rose-600 px-3 py-1.5 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-rose-600 hover:bg-rose-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors shadow-sm shadow-rose-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-700 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs text-rose-200 mb-6">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
              YOUR PERFECT VENUE AWAITS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto">
              Find The Perfect<br />
              <span className="text-rose-400">Venue</span> For Every Celebration
            </h1>
            <p className="text-slate-300 mt-5 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Wedding, Birthday, Corporate Events and more.<br />
              Explore the best venues near you.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link
                to="/venues"
                className="bg-rose-600 hover:bg-rose-700 text-white px-7 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-rose-900/50 flex items-center gap-2"
              >
                Search Venues <ArrowRightIcon />
              </Link>
              <button
                onClick={handleListVenue}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3 rounded-xl font-medium transition-colors"
              >
                List Your Venue
              </button>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="mx-auto max-w-7xl px-4 -mt-6 relative z-10">
          <div className="bg-rose-700 rounded-2xl shadow-xl shadow-rose-900/20 grid grid-cols-2 md:grid-cols-4 divide-x divide-rose-600">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-5 text-center text-white">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-rose-200 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Venues ── */}
        <section className="mx-auto max-w-7xl px-4 pt-16 pb-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Featured Venues</h2>
              <p className="text-sm text-slate-400 mt-1">Handpicked spaces for your special day</p>
            </div>
            <Link
              to="/venues"
              className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
            >
              View all venues <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingList ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                  <div className="w-full h-52 bg-slate-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-4 bg-slate-100 rounded w-1/3 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : venues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {venues.slice(0, 4).map((venue) => (
                <FeaturedVenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm">No venues available yet.</p>
            </div>
          )}
        </section>

        {/* ── How It Works ── */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-800">How It Works</h2>
              <p className="text-sm text-slate-400 mt-2">Four simple steps to your perfect event</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((item, idx) => (
                <div key={item.title} className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-[180px] mx-auto">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why BookMyVenue ── */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800">Why Choose BookMyVenue?</h2>
            <p className="text-sm text-slate-400 mt-2">
              Providing more than just a space, we provide peace of mind for your most important moments.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:border-rose-100 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg font-bold mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">{feat.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-800">What Our Customers Say</h2>
              <div className="flex justify-center items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} className="w-4 h-4 text-amber-400" />
                ))}
              </div>
            </div>

            {reviewsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-6 animate-pulse space-y-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((__, j) => <div key={j} className="w-4 h-4 bg-slate-200 rounded" />)}
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                    <div className="h-3 bg-slate-200 rounded w-3/5" />
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className="w-9 h-9 bg-slate-200 rounded-full" />
                      <div className="space-y-1.5">
                        <div className="h-3 bg-slate-200 rounded w-24" />
                        <div className="h-2.5 bg-slate-200 rounded w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {reviews.slice(0, 3).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 text-sm py-8">
                No reviews yet. Be the first to book and share your experience!
              </p>
            )}
          </div>
        </section>

        {/* ── Own a Venue CTA ── */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="relative bg-gradient-to-br from-slate-900 to-rose-950 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
            </div>
            <div className="relative px-8 md:px-12 py-12 md:py-16 max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Own a Venue?
              </h2>
              <p className="text-rose-200 mt-3 text-sm leading-relaxed">
                List it with BookMyVenue and reach thousands of customers every day. Join our community of premium venue partners.
              </p>
              <ul className="mt-6 space-y-3">
                {["Grow your business revenue", "Get more verified bookings", "Easy management dashboard"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white">
                    <div className="w-5 h-5 rounded-full bg-rose-500/30 border border-rose-400/40 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleListVenue}
                className="mt-8 inline-flex items-center gap-2 bg-white text-rose-700 hover:bg-rose-50 px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg"
              >
                List Your Venue Now <ArrowRightIcon />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;