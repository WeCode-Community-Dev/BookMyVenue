import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("Login Response:", response.data);

    login(response.data.token, response.data.user);

    const role = response.data.user.role;
    if (role === "customer") {
        navigate("/customer/dashboard");
    }
    else if (role === "owner") {
        navigate("/owner/dashboard");
    } 
    else if (role === "root_admin") {
        navigate("/admin/dashboard");
    }

    alert(response.data.message);
    
  } catch (error: any) {
    console.error(error);

    alert(error.response?.data?.message || "Login Failed");
  }
}
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div>
        <label htmlFor="email">Email</label>
        <br />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
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
          placeholder="Enter your password"
          required
        />
      </div>

      <br />

      <button type="submit">Login</button>

      <hr />

    <p>New User?</p>

    <Link to="/register/customer"> Register as Customer </Link>

    <br />
    <br />

    <p>Want to list your venue?</p>

    <Link to="/register/owner">
        Become a Venue Owner
    </Link>
    </form>
  );
}

export default LoginPage;