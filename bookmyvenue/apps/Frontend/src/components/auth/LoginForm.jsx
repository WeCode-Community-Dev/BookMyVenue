import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

function LoginForm({
  isModal = false,
  onSuccess,
  onSwitchToRegister,
}) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await loginUser(email, password);

      login(response.access_token);

      if (onSuccess) {
        onSuccess(response.access_token);
        return;
      }

      const decoded = jwtDecode(response.access_token);
      const role = decoded.role;

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "owner") navigate("/owner/dashboard");
      else if (role === "booker") navigate("/dashboard");
      else navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={
        isModal
          ? ""
          : "mx-auto w-full max-w-md rounded-3xl border bg-white p-8 shadow"
      }
    >
      {!isModal && (
        <>
          <h1 className="text-center text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-center text-gray-500">
            Login to continue
          </p>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-red-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-red-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-red-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-300"
        >
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>

        {isModal ? (
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-semibold text-red-600 hover:underline"
            >
              Register
            </button>
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-red-600 hover:underline"
            >
              Register
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginForm;