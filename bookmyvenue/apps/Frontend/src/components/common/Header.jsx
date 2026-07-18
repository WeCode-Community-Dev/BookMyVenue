// src/components/common/Header.jsx
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";

function Header({ cta }) {
  const navigate = useNavigate();
  const { token, currentUser, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Logo onClick={() => navigate("/")} />

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Optional page-specific CTA passed in as a prop */}
          {cta && (
            <button
              onClick={cta.onClick}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              {cta.label}
            </button>
          )}

          {token ? (
            <>
              {currentUser?.role === "owner" && (
                <button
                  onClick={() => navigate("/owner/dashboard")}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Dashboard
                </button>
              )}

              {currentUser?.role === "booker" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  My Bookings
                </button>
              )}

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
                    ) : !cta ? (
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Sign in
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;

