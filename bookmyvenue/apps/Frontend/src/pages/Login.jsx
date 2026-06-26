import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post(
        "/api/auth/login", 
         new URLSearchParams({
            username: formData.username,
            password: formData.password,
        }),
        {
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
        });

      const token = response.data.access_token;

      login(token);

      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      console.log(decodedToken, "role----")

      if (role === "RoleEnum.BOOKER") {
        navigate("/dashboard");
      } else if (role === "RoleEnum.OWNER") {
        navigate("/owner/dashboard");
      } else if (role === "RoleEnum.ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;