import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/axios";
import AuthLayout from "../../components/auth/AuthLayout";
import OtpInput from "../../components/auth/OtpInput";
import PasswordInput from "../../components/auth/PasswordInput";

const authLinkClass =
  "font-medium text-red-600 underline-offset-2 transition-colors hover:text-red-700 hover:underline";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await api.post("/auth/reset-password", {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <AuthLayout
        brandingTitle="Reset your password"
        brandingSubtitle="Start from the forgot password page to receive a verification code."
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Invalid Request
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please start from Forgot Password.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
          >
            Go to Forgot Password
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      brandingTitle="Choose a new password"
      brandingSubtitle="Enter the code from your email and set a secure new password."
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Code sent to{" "}
          <span className="break-all font-medium text-gray-900">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Verification code
            </label>
            <OtpInput
              value={formData.otp}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, otp: value }));
                setErrors((prev) => ({ ...prev, otp: "" }));
              }}
              disabled={loading}
              error={errors.otp}
            />
          </div>

          <div>
            <label
              htmlFor="reset-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <PasswordInput
              id="reset-password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={loading}
              error={errors.newPassword}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
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

export default ResetPassword;
