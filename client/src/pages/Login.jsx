import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
function Login() {
  usePageTitle("Login");
  const navigate = useNavigate();
  const { login, getDashboardPathByRole } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await login(formData);

      const role = result.user?.role || "user";

      navigate(getDashboardPathByRole(role), {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f5] px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-[#4a1625] flex items-center justify-center">
            <MapPin size={24} className="text-white" />
          </div>

          <h1 className="text-3xl font-semibold">
            BookMy<span className="text-[#8b1e2d]">Venue</span>
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              type="button"
              className="flex-1 py-2 rounded-full bg-white shadow-sm font-medium"
            >
              Sign In
            </button>

            <Link
              to="/register"
              className="flex-1 py-2 text-center text-gray-500 font-medium"
            >
              Create Account
            </Link>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left text-sm mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
              />
            </div>

            <div>
              <label className="block text-left text-sm mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-red-600 to-[#4a1625] hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t"></div>
          </div>

          <button
            type="button"
            disabled
            className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-gray-400 cursor-not-allowed"
          >
            <span>🔵</span>
            Continue with Google
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Google login is not enabled in this MVP.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-500 hover:text-[#8b1e2d]"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
