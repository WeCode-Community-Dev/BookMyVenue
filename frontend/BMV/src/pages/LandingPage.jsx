import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import heroImage from "../assets/hero.png";

const STEPS = [
  {
    step: "1",
    title: "Browse venues",
    text: "Search approved venues by name, location, and type.",
  },
  {
    step: "2",
    title: "Book your slot",
    text: "Pick a date and time, check availability, and reserve instantly.",
  },
  {
    step: "3",
    title: "Pay & track",
    text: "Complete checkout and follow your order from one place.",
  },
];

const STATS = [
  { value: "10,000+", label: "Happy customers" },
  { value: "2,500+", label: "Venues listed" },
  { value: "15,000+", label: "Bookings completed" },
];

const CUSTOMER_FEATURES = [
  "Search and filter venues by location",
  "Real-time slot availability",
  "Secure checkout and payments",
  "Order history and profile management",
];

const OWNER_FEATURES = [
  "List and manage your venues",
  "Accept or reject booking requests",
  "Owner dashboard with booking overview",
  "Revenue and calendar insights",
];

function LandingPage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isOwner = user?.is_venue_owner;
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-200">
              BMV
            </div>
            <span className="font-bold text-slate-800 hidden sm:inline">BookMyVenue</span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5 text-sm">
            <Link to="/venues" className="text-slate-600 hover:text-blue-600">
              Browse venues
            </Link>
            {isAuthenticated ? (
              <>
                {isOwner && (
                  <Link
                    to="/owner/dashboard"
                    className="text-slate-600 hover:text-blue-600 hidden sm:inline"
                  >
                    Owner dashboard
                  </Link>
                )}
                {!isOwner && user?.role === "user" && (
                  <Link to="/dashboard" className="text-slate-600 hover:text-blue-600">
                    Go to dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="text-slate-600 hover:text-blue-600">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-blue-600">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-3">
                Venue booking made simple
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                Find and book the perfect venue for every occasion
              </h1>
              <p className="text-slate-500 mt-4 text-base md:text-lg max-w-lg leading-relaxed">
                Weddings, corporate events, parties, and celebrations — discover approved
                venues, book your date, and manage everything in one place.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/venues"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg shadow-blue-200 transition-colors"
                >
                  Browse venues
                </Link>
                <Link
                  to="/register-venue-owner"
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  List your venue
                </Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white p-2">
              <img
                src={heroImage}
                alt="Event venue"
                className="w-full h-64 md:h-80 object-cover rounded-xl"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-slate-100 p-5 text-center"
              >
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">How it works</h2>
            <p className="text-sm text-slate-400 mt-2">Three steps from search to celebration</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-slate-100 p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Get started</h2>
            <p className="text-sm text-slate-400 mt-2">Choose how you want to use BookMyVenue</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-md hover:border-blue-100 transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">For customers</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Book venues for your events, manage orders, and keep your profile up to date.
              </p>
              <ul className="mt-4 space-y-2">
                {CUSTOMER_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-6">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="border border-slate-200 hover:border-blue-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Create account
                </Link>
                <Link to="/venues" className="text-blue-600 hover:underline text-sm py-2">
                  Browse without account →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-md hover:border-blue-100 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">For venue owners</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                List your space, handle booking requests, and grow your business on our platform.
              </p>
              <ul className="mt-4 space-y-2">
                {OWNER_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-6">
                <Link
                  to="/register-venue-owner"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Register as host
                </Link>
                <Link
                  to="/login"
                  className="border border-slate-200 hover:border-blue-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium"
                >
                  Host sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-10 text-center text-white shadow-lg shadow-blue-200">
            <h2 className="text-2xl font-bold">Ready to find your venue?</h2>
            <p className="text-blue-100 mt-2 text-sm max-w-md mx-auto">
              Explore hundreds of approved venues or join as a host and start receiving bookings today.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link
                to="/venues"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl text-sm font-medium"
              >
                Browse venues
              </Link>
              <Link
                to="/register-venue-owner"
                className="border border-white/40 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-sm font-medium"
              >
                Become a host
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
              BMV
            </div>
            <span>© {new Date().getFullYear()} BookMyVenue</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Register</Link>
            <Link to="/register-venue-owner" className="hover:text-blue-600">Venue owner</Link>
            <Link to="/venues" className="hover:text-blue-600">Browse venues</Link>
            <Link to="/admin/login" className="hover:text-blue-600 text-slate-400">Superadmin</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
