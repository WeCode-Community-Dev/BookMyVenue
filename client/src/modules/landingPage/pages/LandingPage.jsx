import { useState, useEffect } from "react";

const NAV_LINKS = ["Venues", "How It Works", "For Owners", "Pricing"];

const CATEGORIES = [
  { icon: "💍", label: "Weddings" },
  { icon: "🏢", label: "Corporate" },
  { icon: "🎉", label: "Parties" },
  { icon: "🌿", label: "Outdoor" },
  { icon: "🎓", label: "Graduation" },
  { icon: "🎭", label: "Performances" },
];

const VENUES = [
  {
    id: 1,
    name: "The Grand Pavilion",
    location: "Mumbai, Maharashtra",
    type: "Wedding Hall",
    price: "₹85,000",
    rating: 4.9,
    reviews: 312,
    capacity: "500 guests",
    color: "#FFF7ED",
    accent: "#F97316",
    emoji: "🏛️",
  },
  {
    id: 2,
    name: "Skyline Conference Hub",
    location: "Bangalore, Karnataka",
    type: "Corporate",
    price: "₹45,000",
    rating: 4.7,
    reviews: 189,
    capacity: "200 guests",
    color: "#EFF6FF",
    accent: "#3B82F6",
    emoji: "🏢",
  },
  {
    id: 3,
    name: "Serenity Garden Estate",
    location: "Jaipur, Rajasthan",
    type: "Outdoor Garden",
    price: "₹60,000",
    rating: 4.8,
    reviews: 241,
    capacity: "350 guests",
    color: "#F0FDF4",
    accent: "#22C55E",
    emoji: "🌿",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Search",
    desc: "Filter by location, date, capacity and occasion type.",
    icon: "🔍",
  },
  {
    n: "2",
    title: "Book",
    desc: "Pick your date, confirm details, and reserve instantly.",
    icon: "📅",
  },
  {
    n: "3",
    title: "Pay",
    desc: "Pay securely online. Full refund protection included.",
    icon: "✅",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Bride · Mumbai",
    text: "Found our dream wedding hall in under 10 minutes. Booking was so easy!",
    initials: "PS",
    color: "#FEE2E2",
  },
  {
    name: "Rohan Mehta",
    role: "Event Manager · Bangalore",
    text: "We use BookMyVenue for all corporate events. The owner portal is excellent.",
    initials: "RM",
    color: "#DBEAFE",
  },
  {
    name: "Ananya K.",
    role: "Birthday Host · Chennai",
    text: "Booked a stunning rooftop in 5 minutes. Everything was perfect.",
    initials: "AK",
    color: "#DCFCE7",
  },
];

const AVATAR_COLORS = ["#FEE2E2", "#DBEAFE", "#DCFCE7", "#FEF9C3"];
const OWNER_FEATURES = [
  "Free to list your venue",
  "Real-time booking management",
  "Instant & secure payouts",
  "Detailed analytics dashboard",
];

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState({
    location: "",
    date: "",
    guests: "",
    type: "",
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900 overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-100 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-[12px]" : "bg-white"
      }`}>
        <div className="flex items-center justify-between h-[68px] px-5 sm:px-8 lg:px-[6%]">

          {/* Logo */}
          <div className="flex items-center gap-2 font-extrabold text-lg tracking-tight shrink-0">
            <div className="w-8 h-8 bg-gray-900 rounded-[10px] flex items-center justify-center text-base">
              🏛
            </div>
            <span>BookMyVenue</span>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex gap-8">
            {NAV_LINKS.map((l) => (
              <span key={l} className="text-gray-500 text-[0.9rem] font-medium cursor-pointer transition-colors hover:text-gray-900">
                {l}
              </span>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button className="btn-outline !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]">
              Log In
            </button>
            <button className="btn-primary !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]">
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80" : "max-h-0"} bg-white border-t border-gray-100`}>
          <div className="px-5 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <span key={l} className="text-gray-700 font-medium py-2.5 cursor-pointer border-b border-gray-50 last:border-0">
                {l}
              </span>
            ))}
            <div className="flex gap-2.5 mt-3 pt-3 border-t border-gray-100">
              <button className="btn-outline flex-1 !py-2.5 !text-[0.88rem] !rounded-[10px]">Log In</button>
              <button className="btn-primary flex-1 !py-2.5 !text-[0.88rem] !rounded-[10px]">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 sm:pt-32 pb-14 sm:pb-20 px-5 sm:px-8 lg:px-[6%] max-w-[1200px] mx-auto">

        {/* Badge */}
        <div className="animate-fade-up-0 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3.5 py-[5px] mb-5 sm:mb-6">
          <span className="w-[7px] h-[7px] rounded-full bg-green-500 inline-block shrink-0" />
          <span className="text-[0.75rem] sm:text-[0.78rem] font-semibold text-green-700">
            10,000+ venues across India
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-0 text-[2.2rem] sm:text-[3rem] lg:text-[clamp(3rem,5.5vw,4.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] max-w-[700px] mb-4 sm:mb-5">
          Book the perfect venue for every occasion
        </h1>

        <p className="animate-fade-up-1 text-base sm:text-[1.1rem] text-gray-500 max-w-[500px] leading-[1.7] mb-8 sm:mb-10 font-normal">
          Weddings, corporate events, parties and more — discover, compare and book in minutes.
        </p>

        {/* ── SEARCH BAR ── */}
        {/* Mobile: vertical stack | Desktop: horizontal row */}
        <div className="animate-fade-up-2 max-w-[860px]">

          {/* Desktop search bar */}
          <div className="hidden md:flex items-center bg-white border-2 border-gray-200 rounded-[18px] px-5 py-[18px] gap-0 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="search-field pr-5 pl-1">
              <span className="search-label">📍 Location</span>
              <input className="search-input" placeholder="City or area"
                value={search.location} onChange={(e) => setSearch(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="w-px h-10 bg-gray-200 shrink-0" />
            <div className="search-field px-5">
              <span className="search-label">📅 Date</span>
              <input className="search-input" type="date"
                value={search.date} onChange={(e) => setSearch(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="w-px h-10 bg-gray-200 shrink-0" />
            <div className="search-field px-5">
              <span className="search-label">👥 Guests</span>
              <input className="search-input" type="number" placeholder="How many?"
                value={search.guests} onChange={(e) => setSearch(p => ({ ...p, guests: e.target.value }))} />
            </div>
            <div className="w-px h-10 bg-gray-200 shrink-0" />
            <div className="search-field px-5">
              <span className="search-label">🎯 Type</span>
              <select className="search-input" value={search.type}
                onChange={(e) => setSearch(p => ({ ...p, type: e.target.value }))}>
                <option value="">All occasions</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="party">Party</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>
            <button className="btn-primary !rounded-xl whitespace-nowrap shrink-0">
              Search Venues →
            </button>
          </div>

          {/* Mobile search bar: card with stacked fields */}
          <div className="md:hidden bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col gap-0">
            {[
              { label: "📍 Location", type: "text",   key: "location", placeholder: "City or area" },
              { label: "📅 Date",     type: "date",   key: "date",     placeholder: "" },
              { label: "👥 Guests",   type: "number", key: "guests",   placeholder: "How many?" },
            ].map((field, i) => (
              <div key={field.key}>
                <div className="py-3 px-1">
                  <span className="search-label">{field.label}</span>
                  <input
                    className="search-input mt-0.5"
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(search)[field.key]}
                    onChange={(e) => setSearch(p => ({ ...p, [field.key]: e.target.value }))}
                  />
                </div>
                {i < 2 && <div className="h-px bg-gray-100 mx-1" />}
              </div>
            ))}
            <div className="h-px bg-gray-100 mx-1" />
            <div className="py-3 px-1">
              <span className="search-label">🎯 Type</span>
              <select className="search-input mt-0.5" value={search.type}
                onChange={(e) => setSearch(p => ({ ...p, type: e.target.value }))}>
                <option value="">All occasions</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="party">Party</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>
            <button className="btn-primary w-full justify-center mt-1 !rounded-xl">
              Search Venues →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-up-3 flex flex-wrap items-center gap-x-8 gap-y-4 mt-8 sm:mt-10">
          {[["10K+", "Venues"], ["50K+", "Bookings"], ["4.8 ★", "Avg Rating"]].map(([n, l]) => (
            <div key={l} className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight">{n}</span>
              <span className="text-gray-400 text-sm font-medium">{l}</span>
            </div>
          ))}

          <div className="hidden sm:block h-5 w-px bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="flex">
              {["PS", "RM", "AK", "KV"].map((initials, idx) => (
                <div key={initials}
                  style={{ background: AVATAR_COLORS[idx] }}
                  className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[0.65rem] font-bold text-gray-600 ${idx !== 0 ? "-ml-2" : ""}`}>
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-gray-500 text-sm">Trusted by thousands</span>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-12 sm:py-[60px] px-5 sm:px-8 lg:px-[6%] bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-7">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-gray-400 mb-1.5">
                Browse by occasion
              </p>
              <h2 className="text-[1.5rem] sm:text-[1.8rem] font-extrabold tracking-tight">
                What are you planning?
              </h2>
            </div>
            <button className="btn-outline !text-[0.85rem] self-start sm:self-auto shrink-0">
              View all →
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <div key={c.label} className="cat-chip">
                <span className="text-xl">{c.icon}</span>
                {c.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED VENUES ── */}
      <section className="py-14 sm:py-[70px] px-5 sm:px-8 lg:px-[6%] bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-9">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-gray-400 mb-1.5">
                Handpicked for you
              </p>
              <h2 className="text-[1.5rem] sm:text-[1.8rem] font-extrabold tracking-tight">
                Featured Venues
              </h2>
            </div>
            <button className="btn-outline !text-[0.85rem] !bg-white self-start sm:self-auto shrink-0">
              See all venues →
            </button>
          </div>

          {/* 1 col mobile → 2 col tablet → 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VENUES.map((v) => (
              <div key={v.id} className="venue-card">
                <div
                  className="h-[180px] sm:h-[200px] flex items-center justify-center text-[4rem] relative"
                  style={{ background: v.color }}
                >
                  {v.emoji}
                  <div
                    className="absolute top-3.5 left-3.5 bg-white rounded-lg px-2.5 py-1 text-[0.72rem] font-bold"
                    style={{ color: v.accent }}
                  >
                    {v.type}
                  </div>
                  <div className="absolute top-3.5 right-3.5 bg-white rounded-lg px-2.5 py-1 text-[0.72rem] font-bold text-gray-900">
                    ★ {v.rating}
                  </div>
                </div>

                <div className="px-5 pt-5 pb-[22px]">
                  <h3 className="text-[1.05rem] font-bold mb-1 tracking-tight">{v.name}</h3>
                  <p className="text-[0.82rem] text-gray-400 font-medium mb-3.5">📍 {v.location}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[v.capacity, `${v.reviews} reviews`].map((tag) => (
                      <span key={tag} className="bg-gray-100 rounded-lg px-2.5 py-1 text-[0.75rem] font-semibold text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[1.2rem] font-extrabold tracking-tight">{v.price}</span>
                      <span className="text-[0.78rem] text-gray-400"> / day</span>
                    </div>
                    <button className="btn-primary !py-[9px] !px-[18px] !text-[0.82rem] !rounded-[10px]">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-[6%] bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10 sm:mb-[52px]">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">
              Simple process
            </p>
            <h2 className="text-[1.8rem] sm:text-[2rem] font-extrabold tracking-[-0.03em]">
              Book in 3 easy steps
            </h2>
          </div>
          {/* 1 col mobile → 3 col desktop */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            {STEPS.map((step) => (
              <div key={step.n} className="step-card">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center text-[1.2rem] shrink-0">
                    {step.icon}
                  </div>
                  <div className="w-7 h-7 border-2 border-gray-200 rounded-full flex items-center justify-center text-[0.8rem] font-extrabold text-gray-400 shrink-0">
                    {step.n}
                  </div>
                </div>
                <h3 className="text-[1.15rem] font-bold mb-2 tracking-tight">{step.title}</h3>
                <p className="text-[0.88rem] text-gray-500 leading-[1.7]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OWNER BANNER ── */}
      <section className="py-14 sm:py-[70px] px-5 sm:px-8 lg:px-[6%] bg-gray-900">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10">
          <div className="lg:max-w-[480px]">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-gray-500 mb-3">
              For Venue Owners
            </p>
            <h2 className="text-[1.8rem] sm:text-[2.2rem] lg:text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.15] mb-4">
              List your venue and reach thousands of customers
            </h2>
            <p className="text-gray-400 text-[0.95rem] leading-[1.7]">
              Free to list. Manage bookings, track revenue, and grow your business — all from one dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 lg:shrink-0">
            {OWNER_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-[22px] h-[22px] bg-green-500 rounded-full flex items-center justify-center text-[0.65rem] text-white font-extrabold shrink-0">
                  ✓
                </div>
                <span className="text-gray-300 text-[0.9rem] font-medium">{f}</span>
              </div>
            ))}
            <button className="mt-2 bg-white text-gray-900 rounded-xl px-7 py-3.5 font-bold text-[0.95rem] cursor-pointer transition-colors duration-200 hover:bg-gray-100 w-full sm:w-auto">
              List Your Venue →
            </button>
          </div>
        </div>
      </section>


      {/* ── FINAL CTA ── */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 text-center bg-gray-50 border-t border-gray-100">
        <div className="max-w-[560px] mx-auto">
          <h2 className="text-[2rem] sm:text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] leading-[1.15] mb-4">
            Find your perfect venue today
          </h2>
          <p className="text-gray-500 text-base sm:text-[1rem] leading-[1.7] mb-8">
            Join 50,000+ event planners who trust BookMyVenue for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn-primary !text-[1rem] !py-[15px] !px-8 justify-center">
              Browse Venues →
            </button>
            <button className="btn-outline !text-[1rem] !py-[15px] !px-7 justify-center">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-100 py-12 px-5 sm:px-8 lg:px-[6%]">
        <div className="max-w-[1200px] mx-auto">
          {/* 1 col mobile → 2 col tablet → 4 col desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
            {/* Brand — full width on mobile */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="w-[30px] h-[30px] bg-gray-900 rounded-lg flex items-center justify-center text-[15px]">
                  🏛
                </div>
                <span className="font-extrabold text-[1.1rem] tracking-tight">BookMyVenue</span>
              </div>
              <p className="text-gray-400 text-[0.85rem] leading-[1.7] max-w-[240px]">
                India's most trusted venue booking platform for every occasion.
              </p>
            </div>

            {[
              { title: "Platform",     links: ["Browse Venues", "How It Works", "Pricing", "Mobile App"] },
              { title: "Venue Owners", links: ["List a Venue", "Owner Login", "Analytics", "Payouts"] },
              { title: "Company",      links: ["About", "Blog", "Careers", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-gray-400 mb-3 sm:mb-4">
                  {col.title}
                </p>
                {col.links.map((l) => (
                  <div key={l} className="text-[0.88rem] text-gray-700 font-medium mb-2 sm:mb-2.5 cursor-pointer hover:text-gray-900 transition-colors">
                    {l}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <span className="text-[0.82rem] text-gray-400">
              © 2026 BookMyVenue.
            </span>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {["Privacy Policy", "Terms of Use", "Support"].map((l) => (
                <span key={l} className="text-[0.82rem] text-gray-400 cursor-pointer hover:text-gray-700 transition-colors">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
