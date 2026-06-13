import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role,setRole] = useState("User");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) { setError("All fields are required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    setTimeout(() => {
      login({ name: form.name, email: form.email, phone: form.phone });
      navigate("/");
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
          <h2>Join Us Today!</h2>
          <p>Create your account and start booking the most beautiful venues for your celebrations.</p>
          <div className="auth-decorations">
            <span>💍</span><span>🎂</span><span>🥂</span><span>🎉</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <div className="createBtnDiv">
            <button type="button" className={`create-btn ${role === "User" ? "Active" : ""}`} onClick={() => setRole("User")}>User</button>
            <button type="button" className={`create-btn ${role === "Customer" ? "Active" : ""}`} onClick={ ()=> setRole("Customer")}>Customer</button>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          {role == "User" ? (
            <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Rahul Sharma" value={form.name} onChange={set("name")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} className="form-input" />
                </div>
              </div>

              <label className="checkbox-label terms-label">
                <input type="checkbox" required />
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
            </>
          ) : (
            <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Venue Name</label>
                <input type="text" placeholder="Rahul Sharma" value={form.name} onChange={set("name")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Business Name</label>
                <input type="text" placeholder="The Heritage Hall" value={form.businessName} onChange={set("businessName")} className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} className="form-input" />
                </div>
              </div>

              <label className="checkbox-label terms-label">
                <input type="checkbox" required />
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
            </>
          )}

          <div className="auth-divider"><span>or sign up with</span></div>
          <div className="social-auth">
            <button className="social-auth-btn">🅶 Google</button>
            <button className="social-auth-btn">📘 Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
}