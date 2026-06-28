import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/axios";
import AuthLayout from "../../components/auth/AuthLayout";
import OtpInput from "../../components/auth/OtpInput";

const authLinkClass =
  "font-medium text-red-600 underline-offset-2 transition-colors hover:text-red-700 hover:underline";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Invalid verification request. Please register again.");
      return;
    }

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/verify-email", {
        email,
        otp,
      });

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Email not found");
      return;
    }

    try {
      setResending(true);

      const { data } = await api.post("/auth/resend-otp", {
        email,
      });

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      brandingTitle="Almost there"
      brandingSubtitle="Verify your email to secure your account and start booking."
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Verify email
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter the 6-digit code sent to
        </p>

        {email ? (
          <p className="mt-2 break-all text-sm font-medium text-gray-900">
            {email}
          </p>
        ) : (
          <p className="mt-2 text-sm font-medium text-red-600">
            No email found. Please register again.
          </p>
        )}

        <form onSubmit={handleVerify} className="mt-8 space-y-6" noValidate>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Verification code
            </label>
            <OtpInput
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError("");
              }}
              disabled={loading}
              error={error}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resending || loading}
          className="mt-4 w-full text-sm font-medium text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? "Sending OTP..." : "Resend OTP"}
        </button>

        <p className="mt-8 text-center text-sm text-gray-500">
          Wrong email?{" "}
          <Link to="/register" className={authLinkClass}>
            Register Again
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
