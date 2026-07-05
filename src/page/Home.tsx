import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import VideoBg from "../components/VideoBg";
import Navbar from "../components/Navbar";

import BG_VIDEO from "../assets/video/vd1.mp4";

function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || "user";
  return (
    <section className="relative w-full min-h-screen sm:h-screen overflow-hidden bg-[#0a0a0c]">
      <VideoBg
        src={BG_VIDEO}
      />

      {/* Navigation */}
      <Navbar />

      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      <div className="relative z-10 flex flex-col items-center text-center pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6">
        <h1
          className="font-normal leading-[0.95] text-white text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem] max-w-5xl"
          style={{
            fontFamily:
              "'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "-0.035em",
          }}
        >
          {role === "venue_owner" ? (
            <>
              Manage and grow your venues{" "}
              <span className="text-[#c5a059]">with absolute ease</span>
            </>
          ) : (
            <>
              Book or host venues{" "}
              <span className="text-[#c5a059]">with absolute ease</span>
            </>
          )}
        </h1>
        <p className="mt-6 sm:mt-8 text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-md px-2">
          {role === "venue_owner"
            ? "Reach thousands of event organizers, manage bookings, and grow your venue business."
            : "Discover handpicked locations for your next event or unlock the hosting potential of your own space."}{" "}
        </p>
        <Link
          to="/venues"
          className="mt-6 lg:hidden bg-[#c5a059] hover:bg-[#ab8237] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors shadow-md"
        >
          Book Your Venue
        </Link>
      </div>

      <div className="absolute left-4 right-4 sm:right-auto sm:left-6 md:left-10 bottom-6 sm:bottom-8 md:bottom-10 z-10 max-w-sm">
        <div className="flex items-center gap-2 text-white mb-3">
          <Building2 className="w-4 h-4 text-[#c5a059]" />
          <span className="text-sm font-semibold">BookMyVenue</span>
        </div>
        <p className="text-white/80 text-xs leading-relaxed mb-6 max-w-xs font-semibold">
          {role === "venue_owner"
            ? "List your venue, manage bookings, track availability, and connect with thousands of potential customers."
            : "BookMyVenue connects people with local venues for events, meetups, celebrations, and community gatherings through a simple and transparent booking experience."}
        </p>{" "}
        <div className="flex items-center gap-4 flex-wrap">
          {role === "venue_owner" ? (
            <>
              <Link
                to="/addvenues"
                className="bg-[#c5a059] hover:bg-[#ab8237] text-white text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-colors shadow-sm"
              >
                Add Venue
              </Link>

              <Link
                to="/my-venues"
                className="text-white text-sm font-bold hover:opacity-80 transition-opacity flex items-center"
              >
                Manage Venues
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/venues"
                className="bg-[#c5a059] hover:bg-[#ab8237] text-white text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-colors shadow-sm"
              >
                Book Your Venue
              </Link>

              <Link
                to="/mybooking"
                className="text-white text-sm font-bold hover:opacity-80 transition-opacity flex items-center"
              >
                My Booking
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
