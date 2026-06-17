import React, { useEffect, useState } from "react";
import logo from "../../assets/bookmyvenue.webp";
import { useNavigate } from "react-router";
import { useAuth } from "../../shared/context/AuthContext";
const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isOwner = user?.roles?.includes("OWNER");
  const isUser = user?.roles?.includes("USER");

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);

    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
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
            <div className="w-20 h-auto bg-gray-900 rounded-[10px] flex items-center justify-center text-base">
              <img src={logo} alt="BookMyVenue" className="" />
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
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-outline !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]"
                >
                  Log In
                </button>
                <button
                  className="btn-primary !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {isUser && !isOwner && (
                  <button
                    onClick={() => {
                      navigate("/become-partner");
                      setMenuOpen(false);
                    }}
                    className="btn-outline !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]"
                  >
                    Become a Partner
                  </button>
                )}

                {isOwner && (
                  <button
                    className="btn-primary !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]"
                    onClick={() => {
                      navigate("/owner");
                      setMenuOpen(false);
                    }}
                  >
                    Owner Dashboard
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setMenuOpen(false);
                  }}
                  className="btn-outline"
                >
                  Logout
                </button>
              </>
            )}
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
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[600px]" : "max-h-0"
          } bg-white border-t border-gray-100`}
        >
          <div className="px-5 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <span
                key={l}
                className="
          text-gray-700
          font-medium
          py-2.5
          cursor-pointer
          border-b
          border-gray-50
          last:border-0
        "
              >
                {l}
              </span>
            ))}

            <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-gray-100">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="btn-outline"
                  >
                    Log In
                  </button>

                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMenuOpen(false);
                    }}
                    className="btn-primary"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <span className="font-medium">Hi, {user.name}</span>

                  {isUser && !isOwner && (
                    <button
                      onClick={() => {
                        navigate("/become-partner");
                        setMenuOpen(false);
                      }}
                      className="btn-outline"
                    >
                      Become a Partner
                    </button>
                  )}

                  {isOwner && (
                    <button
                      onClick={() => {
                        navigate("/venue/dashboard");
                        setMenuOpen(false);
                      }}
                      className="btn-primary"
                    >
                      Owner Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setMenuOpen(false);
                    }}
                    className="btn-outline"
                  >
                    Logout
                  </button>
                </>
              )}
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
                <div className="w-20 h-auto bg-gray-900 rounded-[10px] flex items-center justify-center text-base">
                  <img src={logo} alt="BookMyVenue" className="" />
                </div>
                <span className="font-extrabold text-[1.1rem] tracking-tight">
                  BookMyVenue
                </span>
              </div>
              <p className="text-gray-400 text-[0.85rem] leading-[1.7] max-w-[240px]">
                India's most trusted venue booking platform for every occasion.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <span className="text-[0.82rem] text-gray-400">
              © 2026 BookMyVenue.
            </span>
            {/* <div className="flex flex-wrap gap-4 sm:gap-6">
              {["Privacy Policy", "Terms of Use", "Support"].map((l) => (
                <span
                  key={l}
                  className="text-[0.82rem] text-gray-400 cursor-pointer hover:text-gray-700 transition-colors"
                >
                  {l}
                </span>
              ))}
            </div> */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
