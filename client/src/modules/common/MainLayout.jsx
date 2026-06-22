import React, { useEffect, useState } from "react";
import logo from "../../assets/bookmyvenue.webp";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../shared/context/AuthContext";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isOwnerArea = location.pathname.startsWith("/owner");

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
        className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-100 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-[12px]" : "bg-white"
          }`}
      >
        <div className="flex items-center justify-between h-[68px] px-5 sm:px-8 ">
          {/* Logo */}
          <div className="flex items-center gap-2 font-extrabold text-lg tracking-tight shrink-0">
            <div className="w-20 h-auto bg-gray-900 rounded-[10px] flex items-center justify-center text-base">
              <img src={logo} alt="BookMyVenue" className="h-16 w-20" />
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
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    Hi, {user.name}
                  </span>
                </div>

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

                {isUser && (
                  <button
                    onClick={() => navigate("/account")}
                    className="btn-outline !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]"
                  >
                    My Account
                  </button>
                )}

                {isOwner && (
                  <button
                    onClick={() => {
                      navigate(
                        isOwnerArea
                          ? "/"
                          : "/owner"
                      );

                      setMenuOpen(false);
                    }}
                    className="btn-primary !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]"
                  >
                    {isOwnerArea
                      ? "Customer Dashboard"
                      : "Owner Dashboard"}
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setMenuOpen(false);
                  }}
                  className="btn-outline !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]"
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
          className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[600px]" : "max-h-0"
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

                  {isUser && (
                    <button
                      onClick={() => {
                        navigate("/account");
                        setMenuOpen(false);
                      }}
                      className="btn-outline"
                    >
                      My Account
                    </button>
                  )}

                  {isOwner && (
                    <button
                      onClick={() => {
                        navigate(
                          isOwnerArea
                            ? "/"
                            : "/owner"
                        );

                        setMenuOpen(false);
                      }}
                      className="btn-primary"
                    >
                      {isOwnerArea
                        ? "Customer Dashboard"
                        : "Owner Dashboard"}
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
      <footer className="border-t border-gray-100 py-8 px-5 sm:px-8 lg:px-[6%]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={logo} alt="" className="w-9 h-9 object-cover" />
            </div>
            <span className="font-medium text-[0.95rem]">BookMyVenue</span>
          </div>

          <p className="text-gray-400 text-[0.82rem] leading-[1.7] max-w-[240px]">
            India's most trusted platform for booking venues for every occasion.
          </p>

          <span className="text-[0.75rem] text-gray-300">
            © 2026 BookMyVenue. All rights reserved.
          </span>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
