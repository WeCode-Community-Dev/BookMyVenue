import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync, resetAuthStatus } from "../modules/auth/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  EyeIcon,
  CalendarIcon,
  MailIcon,
  LockIcon,
  LockCircleIcon,
  ArrowRightIcon,
  PeopleIcon,
  BuildingIcon,
  CheckBadgeIcon,
} from "../icons/icons";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuthAsync } from "../modules/auth/authSlice";

const validate = (fields) => {
  const errors = {};

  if (!fields.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = "Enter a valid email address.";

  if (!fields.password) errors.password = "Password is required.";

  return errors;
};

const INITIAL = {
  email: "",
  password: "",
  rememberMe: true,
};

function LoginPage() {
  const location = useLocation();
  const [fields, setFields] = useState({
    ...INITIAL,
    email: location.state?.prefillEmail || "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  const handleToggleRemember = () => {
    setFields((prev) => ({ ...prev, rememberMe: !prev.rememberMe }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    dispatch(
      loginUserAsync({
        email: fields.email,
        password: fields.password,
        rememberMe: fields.rememberMe,
      }),
    );
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleAuthAsync(credentialResponse.credential));
  };

  const handleGoogleError = () => {
    console.error("Google sign-in failed or was cancelled.");
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
                Find.
                <br />
                Book.
                <br />
                <span className="text-rose-400 underline decoration-rose-400">
                  Celebrate.
                </span>
              </h1>
              <p className="text-white/70 text-sm max-w-sm leading-relaxed mb-6">
                The perfect venue for every occasion, just a few clicks away.
              </p>

              <div className="space-y-2.5 max-w-xs">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 shrink-0">
                    <PeopleIcon />
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">10,000+</p>
                    <p className="text-white/60 text-xs">Happy Customers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 shrink-0">
                    <BuildingIcon />
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">2,500+</p>
                    <p className="text-white/60 text-xs">Venues Listed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/20 text-rose-300 shrink-0">
                    <CheckBadgeIcon />
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">15,000+</p>
                    <p className="text-white/60 text-xs">Bookings Completed</p>
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

              <div className="flex flex-col items-center text-center mb-4">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-100 text-rose-700 mb-2.5">
                  <LockCircleIcon className="w-5 h-5" />
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  Welcome <span className="text-rose-700">Back!</span>
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Login to continue booking your dream venue
                </p>
              </div>

              {error && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                  ❌ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
                <Field label="Email Address" error={errors.email}>
                  <MailIcon className="w-4 h-4" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={fields.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={isLoading}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                  />
                </Field>

                <Field label="Password" error={errors.password}>
                  <LockIcon className="w-4 h-4" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={fields.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </Field>

                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={fields.rememberMe}
                      onChange={handleToggleRemember}
                      disabled={isLoading}
                      className="w-3.5 h-3.5 rounded accent-rose-700 cursor-pointer"
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-rose-700 hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-900 hover:to-rose-950 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white font-semibold py-2.5 rounded-xl text-sm tracking-wide transition-colors"
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
                  {isLoading ? (
                    "Logging in…"
                  ) : (
                    <>
                      Login <ArrowRightIcon />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-medium text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400 mt-4">
                <LockIcon className="w-3 h-3" />
                Your data is safe and encrypted
              </p>

              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-rose-700 hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 border rounded-xl px-3.5 py-2 text-gray-400 transition
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-rose-300 focus-within:border-transparent"}`}
      >
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
}

export default LoginPage;
