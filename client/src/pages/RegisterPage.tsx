import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function RegisterPage() {
  
    const { role } = useParams<{ role: "customer" | "owner" }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  console.time("Registration");

  try {
    
    const endpoint =
        role === "customer"
         ? "/auth/register/customer"
    : "/auth/register/owner";

    const response = await api.post(endpoint, {
    name,
    email,
    password,
});

    console.timeEnd("Registration");

    console.log(response.data);
    alert(response.data.message);

    setName("");
    setEmail("");
    setPassword("");
  } catch (error: any) {
    console.timeEnd("Registration");

    console.error(error);
    alert(error.response?.data?.message || "Registration Failed");
  }
}
  return (
    <form onSubmit={handleSubmit}>
    <h2>
          {role === "customer"
             ? "Register as Customer"
             : "Become a Venue Owner"}
        </h2>

      <div>
        <label htmlFor="name">Name</label>
        <br />

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Enter your name"
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="email">Email</label>
        <br />

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Enter your email"
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="password">
          Password
        </label>

        <br />

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Enter your password"
          required
        />
      </div>

      <br />

      <button type="submit">
        Register
      </button>
    </form>
  );
}

export default RegisterPage;