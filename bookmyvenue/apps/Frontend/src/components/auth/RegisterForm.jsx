import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import {
  registerUser,
} from "../../api/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterForm({
  isModal = false,
  onSuccess,
  onSwitchToLogin,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "booker",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validate() {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Full name is required.");
    } else if (formData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters.");
    } else if (formData.name.trim().length > 50) {
      errors.push("Name must be under 50 characters.");
    }

    if (!formData.email.trim()) {
      errors.push("Email is required.");
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.push("Enter a valid email address.");
    }

    if (!formData.password) {
      errors.push("Password is required.");
    } else if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    } else if (formData.password.length > 100) {
      errors.push("Password must be under 100 characters.");
    }

    if (!formData.confirmPassword) {
      errors.push("Please confirm your password.");
    } else if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match.");
    }

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess(false);

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      setSuccess(true);

      if (onSuccess) {
        onSuccess();
        return;
      }

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Registration failed.");
      } else {
        setError(detail || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={
        isModal
          ? ""
          : "mx-auto w-full max-w-lg rounded-3xl border bg-white p-8 shadow"
      }
    >
      {!isModal && !success && (
        <>
          <h1 className="text-center text-3xl font-bold">
            Create Account
          </h1>
          <p className="mt-2 text-center text-gray-500">
            Join BookMyVenue today.
          </p>
        </>
      )}

      {success ? (
        <div className="py-12 text-center">
          <CheckCircle size={56} className="mx-auto text-green-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Account Created!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Redirecting you to login...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-red-500"
                placeholder="John Doe"
                maxLength={50}
                value={formData.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-red-500"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-red-500"
                placeholder="Min 8 characters"
                maxLength={100}
                value={formData.password}
                onChange={(e) =>
                  updateField("password", e.target.value)
                }
              />
            </div>
            {formData.password.length > 0 && formData.password.length < 8 && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-600">
                <AlertCircle size={12} />
                At least 8 characters required
              </p>
            )}
            {formData.password.length >= 8 && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle size={12} />
                Strong enough
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-red-500"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateField("confirmPassword", e.target.value)
                }
              />
            </div>
            {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle size={12} />
                Passwords do not match
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField("role", "booker")}
                className={`rounded-xl border p-4 text-left transition ${
                  formData.role === "booker"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300 hover:border-red-200"
                }`}
              >
                <div className="font-semibold">Book Venues</div>
                <div className="text-sm text-gray-500">Find venues</div>
              </button>
              <button
                type="button"
                onClick={() => updateField("role", "owner")}
                className={`rounded-xl border p-4 text-left transition ${
                  formData.role === "owner"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-300 hover:border-red-200"
                }`}
              >
                <div className="font-semibold">List Venue</div>
                <div className="text-sm text-gray-500">Rent my space</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {isModal ? (
            <p className="text-center text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-red-600 hover:underline"
              >
                Login
              </button>
            </p>
          ) : (
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-red-600 hover:underline"
              >
                Login
              </Link>
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default RegisterForm;