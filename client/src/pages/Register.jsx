import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
function Register() {
  usePageTitle("Register");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, getDashboardPathByRole } = useAuth();
  const initialRole = searchParams.get("role") === "owner" ? "owner" : "user";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
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

      const result = await register(formData);

      const role = result.user?.role || formData.role;

      navigate(getDashboardPathByRole(role), {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#faf7f5] px-4">
      <div className="w-full max-w-[450px] bg-white p-10 rounded-3xl shadow-lg text-center">
        <h1 className="text-[#4a1625] text-[38px] font-bold mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 mb-8">
          Join BookMyVenue and start booking venues
        </p>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full p-3.5 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-[#8b1e2d] to-[#4a1625] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#8b1e2d] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
