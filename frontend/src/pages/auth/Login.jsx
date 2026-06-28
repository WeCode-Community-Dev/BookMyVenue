import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import BrandName from "../../components/common/BrandName";
import logTheme from "../../assets/log-theme.webp";

const authLinkClass =
  "font-medium text-red-600 underline-offset-2 transition-colors hover:text-red-700 hover:underline";

const authLinkClassSm =
  "text-sm font-medium text-red-600 underline-offset-2 transition-colors hover:text-red-700 hover:underline";

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-gray-300 focus:border-red-500 focus:ring-red-100"
  }`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", formData);

      if (data.success) {
        await refreshUser();

        toast.success("Login successful");

        const redirectTo =
          location.state?.from && typeof location.state.from === "string"
            ? location.state.from
            : "/";

        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      brandingImage={logTheme}
      brandingImagePosition="42% center"
      brandingAlign="center"
      brandingTitle="Sign in to book or host."
      brandingSubtitle={
        <>
          Customers can find and reserve venues; providers can manage listings,
          availability, and bookings, all on{" "}
          <BrandName variant="inline" showLogo={false} />
        </>
      }
      brandingPoints={[
        "Planning a celebration or running a venue? Pick up where you left off on",
        "From wedding halls to meeting spaces, book your next event or run your venue on",
      
      ]}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          <span className="lg:hidden">
            Welcome back to{" "}
            <BrandName
              variant="heading"
              showLogo={false}
              className="whitespace-nowrap"
            />
          </span>
          <span className="hidden lg:inline">Welcome back</span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5" noValidate>
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className={inputClass(errors.email)}
            />
            {errors.email && (
              <p id="login-email-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link to="/forgot-password" className={authLinkClassSm}>
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
              error={errors.password}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className={authLinkClass}>
            Register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
