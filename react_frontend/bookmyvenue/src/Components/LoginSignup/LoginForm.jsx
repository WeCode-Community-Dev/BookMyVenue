import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { getSafeReturnTo } from "../../utils/authNavigation";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = getSafeReturnTo(location.state);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await loginUser(formData);
      navigate(returnTo || "/", { replace: true });
    } catch (error) {
      console.log("Login failed:", error.response?.data || error);
      alert("Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-box">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span>👁</span>
        </div>
      </div>

      <button type="submit" className="create-btn">
        Login
      </button>

      <p className="bottom-login">
        Don&apos;t have an account?{" "}
        <Link to="/signup" state={returnTo ? { returnTo } : undefined}>
          Sign Up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
