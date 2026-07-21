import React, { useState } from "react";
import "./AdminLogin.scss";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../api/adminApi";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../../../redux/slices/adminAuthSlice";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const resp = await adminLogin({ email, password }).unwrap();
      console.log(resp, "resppp");
      if (resp.data.role === "admin") {
        dispatch(setAdminCredentials(resp.data)); // ← set state BEFORE navigating
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err?.data?.message || err?.message || "Login failed");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <h1>Admin Sign In</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn primary" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
