"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register, login, isAuthenticated } from "@/lib/auth";

const ROLES = [
    { value: "user", label: "👤 User — I want to book venues" },
    { value: "owner", label: "🏢 Venue Owner — I want to list spaces" },
];

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) router.replace("/venues");
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password, role);
            // Auto-login after registration
            await login(email, password);
            window.dispatchEvent(new Event("storage"));
            router.push("/venues");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed.");
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
                    background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    position: "relative",
                    animation: "fadeInUp 0.5s ease",
                }}
            >
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
                            Create an account
                        </h1>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                            Join the BookMyVenue community
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {/* Name */}
                        <div>
                            <label htmlFor="reg-name" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Full Name
                            </label>
                            <input
                                id="reg-name"
                                type="text"
                                className="input"
                                placeholder="Jane Smith"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="reg-email" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Email Address
                            </label>
                            <input
                                id="reg-email"
                                type="email"
                                className="input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div>
                                <label htmlFor="reg-password" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Password
                                </label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    className="input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div>
                                <label htmlFor="reg-confirm-password" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Confirm
                                </label>
                                <input
                                    id="reg-confirm-password"
                                    type="password"
                                    className="input"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="reg-role" style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                I am a…
                            </label>
                            <select
                                id="reg-role"
                                className="input"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ cursor: "pointer", appearance: "none" }}
                            >
                                {ROLES.map((r) => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
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
                            id="register-submit-btn"
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
                            {loading ? "Creating account…" : "Create Account"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "1.75rem" }}>
                        Already have an account?{" "}
                        <Link href="/login" style={{ color: "var(--accent-400)", fontWeight: 600 }}>
                            Sign in →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
