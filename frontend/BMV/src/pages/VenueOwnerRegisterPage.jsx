import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  resetAuthStatus, registerVenueOwnerAsync } from "../modules/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

import {
  CalendarIcon,
  BuildingIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  LockIcon,
} from "../icons/icons";

import AccountFieldSection from "../components/AccountFieldSection";
import Field from "../components/Field";

const validateAccountFields = (fields) => {
  const errors = {};

  if (!fields.name.trim()) errors.name = "Name is required.";
  else if (fields.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";

  if (!fields.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = "Enter a valid email address.";

  if (!fields.password) errors.password = "Password is required.";
  else if (fields.password.length < 8)
    errors.password = "Password must be at least 8 characters.";

  if (!fields.confirmPassword)
    errors.confirmPassword = "Please confirm your password.";
  else if (fields.confirmPassword !== fields.password)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
};

const validateBusinessFields = (fields) => {
  const errors = {};

  if (!fields.business_name.trim())
    errors.business_name = "Business name is required.";
  else if (fields.business_name.trim().length < 3)
    errors.business_name = "Business name must be at least 3 characters.";

  if (!fields.business_address.trim())
    errors.business_address = "Business address is required.";
  else if (fields.business_address.trim().length < 5)
    errors.business_address = "Please enter a valid address.";

  if (!fields.contact_person.trim())
    errors.contact_person = "Contact person name is required.";

  if (!fields.business_phone.trim())
    errors.business_phone = "Contact phone number is required.";
  else if (!/^[0-9]{10}$/.test(fields.business_phone.replace(/\D/g, "")))
    errors.business_phone = "Enter a valid 10-digit phone number.";

  if (!fields.business_email.trim())
    errors.business_email = "Business email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.business_email))
    errors.business_email = "Enter a valid email address.";

  return errors;
};

const INITIAL_FIELDS = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",

  business_name: "",
  business_address: "",
  business_type: "",
  contact_person: "",
  business_phone: "",
  business_email: "",
  website: "",
  gst_number: "",
  pan_number: "",
};

function VenueOwnerRegisterPage() {
  const { isAuthenticated, user, isLoading, error, success } = useSelector(
    (state) => state.auth,
  );

  
  const [currentStep, setCurrentStep] = useState(isAuthenticated ? 2 : 1);
  const [fields, setFields] = useState({
    ...INITIAL_FIELDS,
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

 
  useEffect(() => {
    if (isAuthenticated && currentStep === 1) {
      
      setCurrentStep(2);
    }
  }, [isAuthenticated, currentStep]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/owner/dashboard", { replace: true });
        dispatch(resetAuthStatus());
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, dispatch]);

  useEffect(() => {
    return () => dispatch(resetAuthStatus());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleContinueToBusinessStep = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      const validationErrors = validateAccountFields(fields);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        return;
      }
    }

    setErrors({});
    setCurrentStep(2);
  };

  const handleBackToAccountStep = (e) => {
    e.preventDefault();
    setErrors({});
    setCurrentStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const businessErrors = validateBusinessFields(fields);
    if (Object.keys(businessErrors).length) {
      setErrors(businessErrors);
      return;
    }

    setErrors({});

    const payload = {
      business_name: fields.business_name,
      business_address: fields.business_address,
      business_type: fields.business_type,
      contact_person: fields.contact_person,
      business_phone: fields.business_phone,
      business_email: fields.business_email,
      website: fields.website || null,
      gst_number: fields.gst_number || null,
      pan_number: fields.pan_number || null,
    };

    if (!isAuthenticated) {
      payload.name = fields.name;
      payload.email = fields.email;
      payload.phone_number = fields.phone;
      payload.password = fields.password;
    }

    dispatch(registerVenueOwnerAsync(payload));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 h-full p-4 md:p-8 flex">
        <div className="relative w-full max-w-6xl h-full mx-auto rounded-[2rem] border border-white/25 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden flex">
          {/* ── Left — Hero ─────────────────────────────────────────── */}
          <div className="hidden md:flex w-3/5 flex-col justify-start gap-8 p-8 overflow-y-auto scrollbar-hide">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-4 py-2.5 w-fit">
              <span className="text-rose-400">
                <CalendarIcon />
              </span>
              <span className="text-white text-sm font-semibold tracking-tight">
                BookMyVenue
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
                List Your Venue.
                <br />
                <span className="text-rose-400">Reach Thousands</span>
                <br />
                of Customers.
              </h1>
              <p className="text-white/70 text-sm max-w-sm leading-relaxed mb-6">
                Join BookMyVenue and grow your business by connecting with
                people looking for the perfect venue for their special moments.
              </p>

              <div className="space-y-2.5 max-w-xs">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 shrink-0">
                    📈
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Get More Bookings
                    </p>
                    <p className="text-white/60 text-xs">
                      Reach thousands of potential customers every month.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 shrink-0">
                    ⚙️
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Easy Management
                    </p>
                    <p className="text-white/60 text-xs">
                      Manage your venue, availability, and bookings in one
                      place.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 shrink-0">
                    🛡️
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Secure & Trusted
                    </p>
                    <p className="text-white/60 text-xs">
                      We verify every venue to build trust and ensure quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — Form ────────────────────────────────────────── */}
          <div className="flex flex-1 items-start justify-center p-4 md:p-6 overflow-y-auto scrollbar-hide">
            <div className="relative w-full max-w-sm bg-white/90 backdrop-blur-md rounded-3xl shadow-xl px-7 py-6 my-auto">
              <div className="flex md:hidden items-center gap-2 text-gray-800 mb-5 justify-center">
                <span className="text-rose-700">
                  <CalendarIcon />
                </span>
                <span className="text-base font-semibold tracking-tight">
                  BookMyVenue
                </span>
              </div>

              {/* ── Progress Indicator ──────────────────────────────── */}
              <div className="flex flex-col items-center text-center mb-4">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-100 text-rose-700 mb-2.5">
                  <BuildingIcon className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  Register as a Venue Owner
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Create your account and start listing your venue in just a
                  few minutes.
                </p>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-6">
                {/* Step 1 */}
                {!isAuthenticated && (
                  <>
                    <div
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        currentStep >= 1 ? "bg-rose-600" : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                        currentStep >= 1
                          ? "bg-rose-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      1
                    </div>
                  </>
                )}

                {/* Step 2 */}
                <div
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    currentStep >= 2 ? "bg-rose-600" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                    currentStep >= 2
                      ? "bg-rose-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {isAuthenticated ? 1 : 2}
                </div>
              </div>

              {/* Step Labels */}
              <div className="flex justify-between text-xs font-medium text-gray-500 mb-6">
                {!isAuthenticated && <span>Account</span>}
                <span>{isAuthenticated ? "Business" : ""}</span>
                <span>Business</span>
              </div>

              {/* Success/Error Messages */}
              {success && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs">
                  ✅ Account created! Redirecting you now…
                </div>
              )}
              {error && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                  ❌ {error}
                </div>
              )}

              <form onSubmit={currentStep === 1 ? handleContinueToBusinessStep : handleSubmit} noValidate className="space-y-2.5">
                {/* ════════════════════════════════════════════════════ */}
                {/* STEP 1: Account Details (only if NOT logged in) */}
                {/* ════════════════════════════════════════════════════ */}
                {currentStep === 1 && !isAuthenticated && (
                  <>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
                      Account Details
                    </div>

                    <AccountFieldSection
                      fields={fields}
                      errors={errors}
                      onChange={handleChange}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      showConfirmPassword={showConfirmPassword}
                      setShowConfirmPassword={setShowConfirmPassword}
                      isDisabled={isLoading}
                    />

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-900 hover:to-rose-950 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-2.5 rounded-xl text-sm tracking-wide transition-colors"
                    >
                      Continue to Next Step <ArrowRightIcon />
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-rose-700 hover:underline font-medium"
                      >
                        Sign In Now
                      </Link>
                    </p>
                  </>
                )}

                {/* ════════════════════════════════════════════════════ */}
                {/* STEP 2: Business Details */}
                {/* ════════════════════════════════════════════════════ */}
                {currentStep === 2 && (
                  <>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
                      Business Details
                    </div>

                    {/* Show user info if logged in */}
                    {isAuthenticated && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-600">
                          <strong>Name:</strong> {user?.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Email:</strong> {user?.email}
                        </p>
                      </div>
                    )}

                    <Field label="Business / Venue Name *" error={errors.business_name}>
                      <BuildingIcon className="w-4 h-4" />
                      <input
                        name="business_name"
                        type="text"
                        placeholder="e.g. Celestial Banquets"
                        value={fields.business_name}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                      />
                    </Field>

                    <Field label="Business Address *" error={errors.business_address}>
                      <BuildingIcon className="w-4 h-4" />
                      <input
                        name="business_address"
                        type="text"
                        placeholder="Street, city, state, pincode"
                        value={fields.business_address}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Field label="Business Type *" error={errors.business_type}>
                        <select
                          name="business_type"
                          value={fields.business_type}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                        >
                          <option value="">Select type</option>
                          <option value="banquet">Banquet Hall</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="resort">Resort</option>
                          <option value="hotel">Hotel</option>
                          <option value="farmhouse">Farmhouse</option>
                          <option value="garden">Garden</option>
                          <option value="other">Other</option>
                        </select>
                      </Field>

                      <Field label="Contact Person *" error={errors.contact_person}>
                        <input
                          name="contact_person"
                          type="text"
                          placeholder="Full Name"
                          value={fields.contact_person}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Field label="Alternate Phone Number *" error={errors.business_phone}>
                        <input
                          name="business_phone"
                          type="tel"
                          placeholder="+91 (555) 000-0000"
                          value={fields.business_phone}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                        />
                      </Field>

                      <Field label="Business Email *" error={errors.business_email}>
                        <input
                          name="business_email"
                          type="email"
                          placeholder="contact@venue.com"
                          value={fields.business_email}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                        />
                      </Field>
                    </div>

                    <Field label="Website (Optional)">
                      <input
                        name="website"
                        type="url"
                        placeholder="https://www.yourvenue.com"
                        value={fields.website}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Field label="GST Number (Optional)">
                        <input
                          name="gst_number"
                          type="text"
                          placeholder="22AAAAA0000A1Z5"
                          value={fields.gst_number}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                        />
                      </Field>

                      <Field label="PAN Number (Optional)">
                        <input
                          name="pan_number"
                          type="text"
                          placeholder="AAAAA0000A"
                          value={fields.pan_number}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                        />
                      </Field>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex gap-2.5 pt-2">
                      {!isAuthenticated && (
                        <button
                          type="button"
                          onClick={handleBackToAccountStep}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-semibold py-2.5 rounded-xl text-sm tracking-wide transition-colors"
                        >
                          <ArrowLeftIcon /> Back
                        </button>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-900 hover:to-rose-950 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-2.5 rounded-xl text-sm tracking-wide transition-colors"
                      >
                        {isLoading && (
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                        )}
                        {isLoading
                          ? "Creating account…"
                          : isAuthenticated
                            ? "Add Host Profile"
                            : "Create Account"}
                        {!isLoading && <ArrowRightIcon />}
                      </button>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400 mt-4">
                      <LockIcon className="w-3 h-3" />
                      Your data is safe and encrypted
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueOwnerRegisterPage;