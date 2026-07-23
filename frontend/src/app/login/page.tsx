"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.replace("/venues");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      window.dispatchEvent(new Event("storage"));
      router.push("/venues");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "400px",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          animation: "fadeInUp 0.5s ease",
        }}
      >
        {/* Card */}
        <div
          className="glass"
          style={{
            borderRadius: "var(--radius-xl)",
            padding: "2.5rem",
            boxShadow: "var(--shadow-card), var(--shadow-glow)",
          }}
        >
          {/* Brand */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #4f46e5, #818cf8)",
                boxShadow: "0 8px 24px rgba(99,102,241,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.625rem",
                margin: "0 auto 1rem",
              }}
            >
              📍
            </div>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Sign in to your BookMyVenue account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            <div>
              <label
                htmlFor="login-email"
                style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.25)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  color: "var(--error)",
                }}
              >
                {error}
              </div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.8125rem",
                fontSize: "1rem",
                marginTop: "0.25rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              marginTop: "1.75rem",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{ color: "var(--accent-400)", fontWeight: 600 }}
            >
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
