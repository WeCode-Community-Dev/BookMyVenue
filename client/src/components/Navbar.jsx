import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";


function Navbar() {
  const navigate = useNavigate();
  const { user, logout, authLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-[#4a1625] flex items-center justify-center">
            <MapPin size={22} className="text-white" />
          </div>

          <h1 className="text-2xl font-semibold">
            BookMy<span className="text-[#8b1e2d]">Venue</span>
          </h1>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-[#8b1e2d]">
            Home
          </Link>

          <Link to="/venues" className="text-gray-600 hover:text-[#8b1e2d]">
            Venues
          </Link>

          <Link to="/check-status" className="text-gray-600 hover:text-[#8b1e2d]">
            Check Status
          </Link>

          {!authLoading && user?.role === "owner" && (
            <Link
              to="/owner/dashboard"
              className="text-gray-600 hover:text-[#8b1e2d]"
            >
              Owner Dashboard
            </Link>
          )}

          {!authLoading && user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-gray-600 hover:text-[#8b1e2d]"
            >
              Admin Dashboard
            </Link>
          )}

          {!authLoading && user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-[#4a1625]">
                  {user.name}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl border border-[#8b1e2d] text-[#8b1e2d] hover:bg-[#8b1e2d] hover:text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            !authLoading && (
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl bg-[#8b1e2d] text-white hover:bg-[#6f1824] transition"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
export default Navbar;