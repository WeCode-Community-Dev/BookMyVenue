import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      login({ name: email.split("@")[0].replace(".", " "), email });
      navigate(from, { replace: true });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-logo">
            <span>🏛️</span>
            <span>Book<span>My</span>Venue</span>
          </div>
          <h2>Welcome Back!</h2>
          <p>Login to access your bookings and discover amazing venues for your next celebration.</p>
          <div className="auth-decorations">
            <span>💍</span><span>🎂</span><span>🥂</span><span>🎉</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">
            Don't have an account? <Link to="/register">Sign up free</Link>
          </p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>
                Password
                <a href="#" className="forgot-link">Forgot password?</a>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>
          <div className="social-auth">
            <button className="social-auth-btn">🅶 Google</button>
            <button className="social-auth-btn">📘 Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
}