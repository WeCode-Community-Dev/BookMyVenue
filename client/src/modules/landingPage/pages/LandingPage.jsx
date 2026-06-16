import { useState, useEffect } from "react";
import MainLayout from "../../common/MainLayout";
import VenueCardList from "../components/VenueCardList";
import { useAuth } from "../../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchVenuesApi } from "../../venues/api/venue.api";

const NAV_LINKS = ["Venues", "How It Works", "For Owners", "Pricing"];

const CATEGORIES = [
  { icon: "💍", label: "Weddings" },
  { icon: "🏢", label: "Corporate" },
  { icon: "🎉", label: "Parties" },
  { icon: "🌿", label: "Outdoor" },
  { icon: "🎓", label: "Graduation" },
  { icon: "🎭", label: "Performances" },
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

const AVATAR_COLORS = ["#FEE2E2", "#DBEAFE", "#DCFCE7", "#FEF9C3"];

const LandingPage = () => {
  const [search, setSearch] = useState({
    location: "",
    date: "",
    guests: "",
    type: "",
  });

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venues, setVenues] = useState([]);
  const { user } = useAuth();
  const isOwner = user?.roles?.includes("OWNER");
  const navigate = useNavigate();

  // const location = useLocation();

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const response = await fetchVenuesApi();

      const data = response.data;

      setVenues(data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(venues);

  return (
    <MainLayout>
      <div className="font-sans bg-white text-gray-900 overflow-x-hidden">
        <section className="pt-28 sm:pt-32 pb-14 sm:pb-20 px-5 sm:px-8 lg:px-[6%] max-w-[1200px] mx-auto">
          <div className="animate-fade-up-0 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3.5 py-[5px] mb-5 sm:mb-6">
            <span className="w-[7px] h-[7px] rounded-full bg-green-500 inline-block shrink-0" />
            <span className="text-[0.75rem] sm:text-[0.78rem] font-semibold text-green-700">
              10,000+ venues across India
            </span>
          </div>

          <h1 className="animate-fade-up-0 text-[2.2rem] sm:text-[3rem] lg:text-[clamp(3rem,5.5vw,4.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] max-w-[700px] mb-4 sm:mb-5">
            {isOwner
              ? "Grow your venue business with Us"
              : "Book the perfect venue for every occasion"}
          </h1>

          <p className="animate-fade-up-1 text-base sm:text-[1.1rem] text-gray-500 max-w-[500px] leading-[1.7] mb-8 sm:mb-10 font-normal">
            {isOwner
              ? "List your space, manage bookings in real time, and get paid instantly — all from one dashboard."
              : ` Weddings, corporate events, parties and more — discover, compare and
            book in minutes.`}
          </p>

          {/* Stats */}
          <div className="animate-fade-up-3 flex flex-wrap items-center gap-x-8 gap-y-4 mt-8 sm:mt-10">
            {[
              ["10K+", "Venues"],
              ["50K+", "Bookings"],
              ["4.8 ★", "Avg Rating"],
            ].map(([n, l]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight">
                  {n}
                </span>
                <span className="text-gray-400 text-sm font-medium">{l}</span>
              </div>
            ))}

            <div className="hidden sm:block h-5 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="flex">
                {["PS", "RM", "AK", "KV"].map((initials, idx) => (
                  <div
                    key={initials}
                    style={{ background: AVATAR_COLORS[idx] }}
                    className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[0.65rem] font-bold text-gray-600 ${idx !== 0 ? "-ml-2" : ""}`}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                Trusted by thousands
              </span>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        {!isOwner && (
          <>
            {" "}
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

                  {/* <button className="btn-outline !text-[0.85rem] !bg-white self-start sm:self-auto shrink-0">
                    See all venues →
                  </button> */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {venues.map((venue) => (
                    <VenueCardList
                      key={venue.id}
                      name={venue.name}
                      location={venue.location}
                      price={venue.price}
                      city={venue.city}
                      address={venue.address}
                      capacity={venue.capacity}
                      currency={venue.currency}
                      description={venue.description}
                      images={venue.images}
                      type={venue.type}
                    />
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

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                  {STEPS.map((step) => (
                    <div key={step.n} className="step-card">
                      <div className="flex items-center gap-3.5 mb-5">
                        <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center text-[1.2rem] shrink-0">
                          {step.icon}
                        </div>
                        <div className="w-7 h-7 border-2 border-gray-200 rounded-full flex items-center justify-center text-[0.8rem] font-extrabold text-gray-400 shrink-0">
                          {step.n}
                        </div>
                      </div>
                      <h3 className="text-[1.15rem] font-bold mb-2 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-[0.88rem] text-gray-500 leading-[1.7]">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default LandingPage;
