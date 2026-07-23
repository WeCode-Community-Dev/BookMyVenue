import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resendOtp, verifyOtp } from "@/redux/slices/AuthSlice";

import { ROUTES } from "@/constants/routes";

const VerifyOtpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || "";
  const role = location.state?.role;

  const { loading, error } = useSelector((state) => state.auth);

  const [otpCode, setOtpCode] = useState("");
  const [resending, setResending] = useState(false); // Helps manage resend loader state

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otpCode)) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const result = await dispatch(
        verifyOtp({
          role,
          email,
          otpCode,
        })
      );

      if (verifyOtp.fulfilled.match(result)) {
        navigate(ROUTES.PUBLIC.LOGIN, {
          state: {
            role,
            email,
          },
        });
      }
    } catch (err) {
      console.error("An error occurred during verification:", err);
    }
  };

  const handleResendOtp = async () => {
    if (!email || !role) return;

    setResending(true);

    try {
      const result = await dispatch(
        resendOtp({
          role,
          email,
        })
      );

      if (resendOtp.fulfilled.match(result)) {
        setCountdown(30);
        setCanResend(false);
        setOtpCode(""); // Clear old OTP input field
      }
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    } finally {
      setResending(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <Mail className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-800">
          Verify Your Email
        </h2>

        <p className="text-center text-slate-500 mt-2 mb-6">
          We sent a 6-digit OTP to <b>{email}</b>
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              OTP Code
            </label>

            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.trim())}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-5">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="text-amber-600 font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-gray-500">Resend OTP in {countdown}s</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(ROUTES.PUBLIC.LOGIN)}
            className="text-slate-500 hover:text-slate-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpForm;