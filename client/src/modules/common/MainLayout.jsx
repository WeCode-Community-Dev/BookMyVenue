import React, { useEffect, useState } from "react";

const MainLayout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  
  const NAV_LINKS = ["Venues", "How It Works", "For Owners", "Pricing"];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-100 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-[12px]" : "bg-white"
        }`}
      >
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
              <span
                key={l}
                className="text-gray-500 text-[0.9rem] font-medium cursor-pointer transition-colors hover:text-gray-900"
              >
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
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            />
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80" : "max-h-0"} bg-white border-t border-gray-100`}
        >
          <div className="px-5 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <span
                key={l}
                className="text-gray-700 font-medium py-2.5 cursor-pointer border-b border-gray-50 last:border-0"
              >
                {l}
              </span>
            ))}
            <div className="flex gap-2.5 mt-3 pt-3 border-t border-gray-100">
              <button className="btn-outline flex-1 !py-2.5 !text-[0.88rem] !rounded-[10px]">
                Log In
              </button>
              <button className="btn-primary flex-1 !py-2.5 !text-[0.88rem] !rounded-[10px]">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-100 py-12 px-5 sm:px-8 lg:px-[6%]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="w-[30px] h-[30px] bg-gray-900 rounded-lg flex items-center justify-center text-[15px]">
                  🏛
                </div>
                <span className="font-extrabold text-[1.1rem] tracking-tight">
                  BookMyVenue
                </span>
              </div>
              <p className="text-gray-400 text-[0.85rem] leading-[1.7] max-w-[240px]">
                India's most trusted venue booking platform for every occasion.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: [
                  "Browse Venues",
                  "How It Works",
                  "Pricing",
                  "Mobile App",
                ],
              },
              {
                title: "Venue Owners",
                links: ["List a Venue", "Owner Login", "Analytics", "Payouts"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-gray-400 mb-3 sm:mb-4">
                  {col.title}
                </p>
                {col.links.map((l) => (
                  <div
                    key={l}
                    className="text-[0.88rem] text-gray-700 font-medium mb-2 sm:mb-2.5 cursor-pointer hover:text-gray-900 transition-colors"
                  >
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
                <span
                  key={l}
                  className="text-[0.82rem] text-gray-400 cursor-pointer hover:text-gray-700 transition-colors"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
