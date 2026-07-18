import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

/* ---------- Inline icons ---------- */
const IconClose = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconMail = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconLock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconUser = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/* ---------- Brand SVG marks for social buttons ---------- */
const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6.9 0 9.5-4.8 9.5-7.3 0-.5-.1-.9-.1-1.3H12z"/>
  </svg>
);
const AppleMark = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#000" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.2-2.5.7-1 1-2 1.4-3.1-3.7-1.4-3.1-5.6-3.1-5.7zM13.8 4.6c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.5-.7.8-1.3 2-1.1 3.2 1.2.1 2.3-.6 3-1.4z"/>
  </svg>
);
const FacebookMark = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#1877F2" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"/>
  </svg>
);

/* ---------- Reusable bits ---------- */
function SocialButton({ icon, label }) {
  return (
    <button
      type="button"
      disabled
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-90"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Divider({ children }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {children}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function Field({ icon, ...inputProps }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        {...inputProps}
        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
      />
    </div>
  );
}

/* ---------- Login form ---------- */
function LoginForm({ onSwitch, onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post(
        "/api/auth/login",
        new URLSearchParams({
          username: formData.username,
          password: formData.password,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      const token = response.data.access_token;
      login(token);
      const decodedToken = jwtDecode(token);
            const role = decodedToken.role;

      onClose?.();

      if (role === "booker") navigate("/dashboard");
      else if (role === "owner") navigate("/owner/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
      <p className="mt-1 text-sm text-gray-500">
        Welcome back. Continue your venue search.
      </p>

      <div className="mt-6 space-y-2.5">
        <SocialButton icon={<GoogleMark />} label="Continue with Google" />
        <SocialButton icon={<AppleMark />} label="Continue with Apple" />
        <SocialButton icon={<FacebookMark />} label="Continue with Facebook" />
      </div>

      <Divider>or</Divider>

      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Field
          icon={<IconMail className="h-4 w-4" />}
          type="email"
          name="username"
          placeholder="Email address"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Field
          icon={<IconLock className="h-4 w-4" />}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-red-600 hover:underline"
        >
          Create one
        </button>
      </p>
    </div>
  );
}

/* ---------- Register form ---------- */
function RegisterForm({ onSwitch, onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "booker",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/register", formData);
      onClose?.();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
      <p className="mt-1 text-sm text-gray-500">
        Join BookMyVenue and book the perfect space.
      </p>

      <div className="mt-6 space-y-2.5">
        <SocialButton icon={<GoogleMark />} label="Sign up with Google" />
        <SocialButton icon={<AppleMark />} label="Sign up with Apple" />
        <SocialButton icon={<FacebookMark />} label="Sign up with Facebook" />
      </div>

      <Divider>or</Divider>

      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Field
          icon={<IconUser className="h-4 w-4" />}
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Field
          icon={<IconMail className="h-4 w-4" />}
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Field
          icon={<IconLock className="h-4 w-4" />}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            I am a
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
          >
            <option value="booker">Booker</option>
            <option value="owner">Venue Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-red-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

/* ---------- Modal shell ---------- */
function AuthModal({ open, onClose, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <IconClose className="h-5 w-5" />
        </button>

        {mode === "login" ? (
          <LoginForm onSwitch={() => setMode("register")} onClose={onClose} />
        ) : (
          <RegisterForm onSwitch={() => setMode("login")} onClose={onClose} />
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
