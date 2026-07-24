import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/axios";
import AuthLayout from "../../components/auth/AuthLayout";

const authLinkClass =
  "font-medium text-red-600 underline-offset-2 transition-colors hover:text-red-700 hover:underline";

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-gray-300 focus:border-red-500 focus:ring-red-100"
  }`;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      return setError("Email is required");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/forgot-password", {
        email,
      });

      toast.success(data.message);

      navigate("/reset-password", {
        state: { email },
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      brandingTitle="Account recovery made simple"
      brandingSubtitle="We'll send a secure verification code to help you reset your password."
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Forgot password
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter your email to receive an OTP.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label
              htmlFor="forgot-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "forgot-email-error" : undefined}
              className={inputClass(error)}
            />
            {error && (
              <p id="forgot-email-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link to="/login" className={authLinkClass}>
            Back to Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
