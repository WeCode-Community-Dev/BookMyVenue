import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { VenueCategory } from "@/constants/Venue";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTopVenues } from "@/redux/slices/UserVenueSlice";
import VenueCard from "../components/common/VenueCard";
import HeroImage from '@/assets/images/Hero.jpg'

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { venues } = useSelector((state) => state.userVenue)

  useEffect(()=> {
    dispatch(getTopVenues())
  }, [dispatch])

  
  return (
    <div className="bg-white">
      <Header />
      <section
        className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${HeroImage})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block bg-amber-500/20 border border-amber-400 text-amber-300 px-5 py-2 rounded-full mb-8 backdrop-blur-sm">
            ✨ India's #1 Venue Booking Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
            Discover Your Perfect
            <br />
            <span className="text-amber-400">Event Venue</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mt-8 max-w-3xl mx-auto leading-relaxed">
            From intimate gatherings to grand celebrations, find and book
            the ideal venue for your special moments.
          </p>

          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate(ROUTES.USER.BROWSE_VENUES)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl transition duration-300"
            >
              Explore Venues
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-10 mt-14 text-white text-lg">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✓</span>
              <span>Verified Venues</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-400">⭐</span>
              <span>4.8 Rating</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-400">🏛️</span>
              <span>5000+ Venues</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Heading */}
          <div className="text-center mb-16">
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-medium mb-5">
              Browse by Category
            </span>

            <h2 className="text-5xl font-bold text-slate-900">
              Find the Perfect Venue
              <span className="block text-amber-500 mt-2">
                For Every Celebration
              </span>
            </h2>

            <p className="text-xl text-slate-600 mt-6 max-w-3xl mx-auto">
              Whether you're planning a wedding, corporate event, birthday party,
              or family gathering, explore venues tailored to every occasion.
            </p>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
            {VenueCategory.map((category) => (
              <div
                key={category}
                className="group bg-white border border-slate-200 rounded-3xl p-8 text-center
                shadow-sm hover:shadow-xl hover:border-amber-400
                hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >

                <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-amber-600 transition">
                  {category}
                </h3>

                <p className="text-slate-500 mt-3 text-sm">
                  Discover premium venues for your {category.toLowerCase()} events.
                </p>
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="flex justify-center mt-16">
            <button
              onClick={() => navigate(ROUTES.USER.BROWSE_VENUES)}
              className="bg-amber-500 hover:bg-amber-600
              text-white px-10 py-4 rounded-xl
              font-semibold text-lg
              shadow-lg hover:shadow-xl
              transition duration-300"
            >
              Browse All Venues →
            </button>
          </div>
        </div>
      </section>

      <section className="bg-amber-50/40 py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-medium mb-5">
                Featured Collection
              </span>

              <h2 className="text-5xl font-bold text-slate-900">
                Featured
                <span className="text-amber-500"> Venues</span>
              </h2>

              <p className="text-lg text-slate-600 mt-4 max-w-xl">
                Explore our handpicked collection of premium venues, carefully
                selected to make every celebration truly unforgettable.
              </p>
            </div>

            <button
              onClick={() => navigate(ROUTES.USER.BROWSE_VENUES)}
              className="self-start md:self-auto border border-amber-500
              text-amber-600 hover:bg-amber-500 hover:text-white
              px-7 py-3 rounded-xl font-semibold
              transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              View All →
            </button>
          </div>

          {/* Venue Cards */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
              />
            ))}
          </div>
        </div>
      </section>


      <section className="bg-amber-50 py-24 border-t border-amber-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-medium mb-6">
            Start Your Journey
          </span>

          <h2 className="text-5xl font-bold text-slate-900">
            Ready to Host Your
            <span className="text-amber-500"> Perfect Event?</span>
          </h2>

          <p className="text-xl text-slate-600 mt-6 max-w-3xl mx-auto">
            Discover thousands of verified venues across India or showcase your own
            venue to reach more customers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-12">
            <button
              onClick={() => navigate(ROUTES.USER.BROWSE_VENUES)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg transition duration-300"
            >
              Browse Venues →
            </button>

            <button
              onClick={() => navigate(ROUTES.VENDOR.VENUES)}
              className="border-2 border-slate-300 text-slate-800 hover:bg-slate-900 hover:text-white px-10 py-4 rounded-xl font-semibold text-lg transition duration-300"
            >
              List Your Venue
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}