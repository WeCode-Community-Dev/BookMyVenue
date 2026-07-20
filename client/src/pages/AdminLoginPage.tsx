import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      const response = await api.post("/auth/root-admin/login", {
        email,
        password,
      });

      console.log("Root Admin Login Response:", response.data);

      login(response.data.token, response.data.user);

      alert(response.data.message);

      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message || "Root Admin Login Failed"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Root Admin Login</h2>

      <div>
        <label htmlFor="email">Email</label>
        <br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter admin password"
          required
        />
      </div>

      <br />

      <button type="submit">
        Login as Root Admin
      </button>

      <hr />

      <Link to="/login">
        Back to User Login
      </Link>
    </form>
  );
}

export default AdminLoginPage;