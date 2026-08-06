import { useState } from "react";
import { Link } from "react-router-dom";
import { LocationModal } from "./LocationModal.jsx";
import { useAuth } from "../../context/authContext.js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [district, setDistrict] = useState("Ernakulam");
  const { user, logout, openLogin } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">


        <div className="flex h-16 items-center gap-3">

          <div className="logo flex items-center gap-2 shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 rounded-lg"><img src="/favicon.png" alt="icon" /></div>
              <h1 className="text-lg font-semibold text-gray-900">
                BookMyVenue
              </h1>
            </Link>
          </div>

          {searchOpen && (
            <div className="pb-3 md:hidden">
              <input
                type="text"
                placeholder="Search venues..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* Desktop */}
          <div className="searchbar hidden flex-1 px-4 md:block">
            <input
              type="text"
              placeholder="Search venues, cafes, auditoriums..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-red-500"
            />
          </div>

          {/* Desktop Nav */}
          <div className="navlinks hidden items-center gap-2 md:flex">

            <button className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-red-500 hover:text-red-600"
              onClick={() => setLocationOpen(true)}
            >
              <span>📍</span>
              <span>{district}</span>
              <span className="text-xs">▼</span>
            </button>

            <Link
             to="/venue"
             className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Venue
            </Link>

            <Link
             to={{pathname:"/venue/category"}}
             className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Category
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">{user.name || user.email}</span>
                <button
                  onClick={logout}
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-red-500 hover:text-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <button
               onClick={openLogin}
               className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                Login
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="ml-auto flex items-center gap-2 md:hidden">

            <button className="p-2 text-gray-600"
              onClick={() => setSearchOpen((e) => !e)}
            >
              🔍
            </button>

            <button className="p-2 text-gray-600"
              onClick={() => setMenuOpen((e) => !e)}
            >
              ☰
            </button>

            {user ? (
              <button
                onClick={logout}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600">
                Logout
              </button>
            ) : (
              <button
               onClick={openLogin}
               className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white">
                Login
              </button>
            )}
          </div>

        </div>

        {/* Mobile Location  */}
        <div className="pb-3 md:hidden">
          <button className="text-sm font-medium text-red-600 hover:text-red-700"
            onClick={() => setLocationOpen(true)}
          >
            📍 {district} ▼
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 py-2 md:hidden">

            <Link
             to="/venue"
             className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Venue
            </Link>

            <Link
             to="/category"
             className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Category
            </Link>

          </div>
        )}

      </div>

      {/* Location Modal */}
      <LocationModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        onSelect={setDistrict}
      />
    </nav>

  )
}

