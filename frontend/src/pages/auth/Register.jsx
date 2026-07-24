import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import toast from "react-hot-toast";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import BrandName from "../../components/common/BrandName";
import regTheme from "../../assets/reg-theme.jpg";

const authLinkClass =
  "font-medium text-red-600 underline-offset-2 transition-colors hover:text-red-700 hover:underline";

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70 ${hasError
    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
    : "border-gray-300 focus:border-red-500 focus:ring-red-100"
  }`;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)
    ) {
      newErrors.password = "Must contain uppercase, lowercase and number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", formData);

      if (data.success) {
        toast.success(data.message);

        navigate("/verify-email", {
          state: {
            email: formData.email,
          },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      brandingImage={regTheme}
      brandingImagePosition="28% center"
      brandingAlign="center"
      brandingTitle="Book Venues. Host Venues."
      brandingSubtitle={
        <>
          Reserve the right space for every occasion, or list your venue, take
          bookings, and build your hosting business, all on{" "}
          <BrandName variant="inline" showLogo={false} />
        </>
      }
      brandingPoints={[
        "Browse venues by city, category, and capacity",
        "Book available slots with secure online payment",
        "List your venue and manage availability as a host",
        "Track bookings from your dashboard in one place",
      ]}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          <span className="lg:hidden">
            Get started with{" "}
            <BrandName
              variant="heading"
              showLogo={false}
              className="whitespace-nowrap"
            />
          </span>
          <span className="hidden lg:inline">Create your account</span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5" noValidate>
          <div>
            <label
              htmlFor="register-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              className={inputClass(errors.name)}
            />
            {errors.name && (
              <p id="register-name-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              className={inputClass(errors.email)}
            />
            {errors.email && (
              <p id="register-email-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="register-phone"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              autoComplete="tel"
              inputMode="numeric"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "register-phone-error" : undefined}
              className={inputClass(errors.phone)}
            />
            {errors.phone && (
              <p id="register-phone-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <PasswordInput
              id="register-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
              error={errors.password}
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className={authLinkClass}>
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
