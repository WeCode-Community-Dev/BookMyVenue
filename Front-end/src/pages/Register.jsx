import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ fname: "", lname: "", email: "", phone: "", password: "", confirm: "" });
  const [cusForm, setCusForm] = useState({ fname: "", lname: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role,setRole] = useState("User");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setCus = (r) => (e) => setCusForm(k => ({ ...k, [r]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.fname || !form.lname || !form.email || !form.phone || !form.password) { setError("All fields are required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);

    try {
      const data = await registerUser({
        firstName: form.fname,
        lastName: form.lname,
        phone: form.phone,
        password: form.password,
        email: form.email,
        role: "END_USER"
      });
      login(data);
      navigate("/");
      console.log(data);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCusSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!cusForm.fname || !cusForm.lname || !cusForm.email || !cusForm.phone || !cusForm.password || !cusForm.confirm) { 
      setError("All fields are required."); return; 
    }
    if (cusForm.password.length < 8) { 
      setError("Password must be at least 8 characters."); return; 
    }
    if (cusForm.password !== cusForm.confirm) { 
      setError("Passwords do not match."); return; 
    }

    setLoading(true);
    try {
      const data = await registerUser({
        firstName: cusForm.fname,
        lastName: cusForm.lname,
        phone: cusForm.phone,
        email: cusForm.email,
        password: cusForm.password,
        role: "VENUE_OWNER"
      });
      login(data);
      navigate("/login"); 
      console.log(data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
                <label>First Name</label>
                <input type="text" placeholder="Rahul" value={form.fname} onChange={set("fname")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Sharma" value={form.lname} onChange={set("lname")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className="form-input" />
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
            <form onSubmit={handleCusSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="Rahul" value={cusForm.fname} onChange={setCus("fname")} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Sharma" value={cusForm.lname} onChange={setCus("lname")} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com" value={cusForm.email} onChange={setCus("email")} className="form-input" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="9876543210" value={cusForm.phone} onChange={setCus("phone")} className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={cusForm.password} onChange={setCus("password")} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="••••••••" value={cusForm.confirm} onChange={setCus("confirm")} className="form-input" />
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