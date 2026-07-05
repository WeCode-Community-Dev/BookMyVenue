import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Save user session details
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      setSuccess(true);

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || 
        (data.user.role === 'admin' 
          ? '/admin' 
          : data.user.role === 'venue_owner' 
            ? '/dashboard' 
            : '/venues');

      setTimeout(() => {
        navigate(redirect);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="relative w-full min-h-screen text-white flex flex-col justify-center overflow-y-auto"
      style={{
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/hixs-evolution.png")',
        backgroundColor: "#0a0a0c",
      }}
    >
      {/* Navigation */}
      <Navbar />

      {/* Gradients */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      {/* Form Card Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-12 pt-32 sm:pt-40">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-normal text-white mb-2"
              style={{
                fontFamily:
                  "'Neue Haas Grotesk Display Pro 55 Roman', 'Neue Haas Grotesk Text Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                letterSpacing: "-0.035em",
              }}
            >
              Get <span className="text-[#c5a059]">Started</span>
            </h1>
            <p className="text-sm text-white/60">
              Create an account to book your beautiful venues
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs uppercase tracking-wider text-white/50 font-semibold"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-transparent border-b border-white/10 focus:border-[#c5a059] focus:outline-none py-2 text-white placeholder-white/20 transition-colors duration-300 font-medium"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-wider text-white/50 font-semibold"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent border-b border-white/10 focus:border-[#c5a059] focus:outline-none py-2 text-white placeholder-white/20 transition-colors duration-300 font-medium"
              />
            </div>
            {/* Role Field */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="role"
                className="text-xs uppercase tracking-wider text-white/50 font-semibold"
              >
                Account Type
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent border-b border-white/10 focus:border-[#c5a059] focus:outline-none py-2 text-white transition-colors duration-300 font-medium"
              >
                <option value="user" className="bg-black">
                  User
                </option>
                <option value="venue_owner" className="bg-black">
                  Venue Owner
                </option>
              </select>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs uppercase tracking-wider text-white/50 font-semibold"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-b border-white/10 focus:border-[#c5a059] focus:outline-none py-2 text-white placeholder-white/20 transition-colors duration-300 font-medium"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs uppercase tracking-wider text-white/50 font-semibold"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-b border-white/10 focus:border-[#c5a059] focus:outline-none py-2 text-white placeholder-white/20 transition-colors duration-300 font-medium"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-red-500 text-xs font-semibold text-center mt-1">
                {errorMsg}
              </p>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3.5 mt-4 bg-[#c5a059] hover:bg-[#ab8237] disabled:bg-[#c5a059]/40 text-white font-semibold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : success ? (
                <span>Account Created ✓</span>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          {/* Card Footer toggle */}
          <div className="mt-8 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#c5a059] font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
