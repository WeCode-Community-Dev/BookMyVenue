"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, getUser, logout } from "@/lib/auth";

export default function Navbar() {
  const [authed, setAuthed] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const check = () => {
      const ok = isAuthenticated();
      setAuthed(ok);
      if (ok) {
        const u = getUser();
        setUserName(u?.name ?? u?.email ?? "User");
        setUserRole(u?.role ?? "");
      } else {
        setUserRole("");
      }
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, [pathname]);

  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";

  function handleLogout() {
    logout();
    setAuthed(false);
    setMenuOpen(false);
    router.push("/");
    // Dispatch storage event so other tabs update
    window.dispatchEvent(new Event("storage"));
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/venues", label: "Venues" },
    ...(authed ? [{ href: "/my-bookings", label: "My Bookings" }] : []),
    ...(isOwnerOrAdmin ? [{ href: "/my-venues", label: "My Venues" }] : []),
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(13, 15, 26, 0.82)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 800,
            fontSize: "1.25rem",
            letterSpacing: "-0.03em",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4f46e5, #818cf8)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.45)",
              fontSize: "1rem",
            }}
          >
            📍
          </span>
          <span
            style={{
              background: "linear-gradient(135deg, #f0f2ff, #a5b4fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BookMyVenue
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
          className="nav-links"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.9rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--accent-300)" : "var(--text-secondary)",
                  background: active
                    ? "rgba(99,102,241,0.14)"
                    : "transparent",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--text-secondary)";
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth section */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {authed ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4f46e5, #818cf8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userName}
              </span>
              <button
                className="btn btn-ghost"
                onClick={handleLogout}
                style={{ fontSize: "0.875rem", padding: "0.375rem 0.875rem" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-ghost"
                style={{ fontSize: "0.875rem", padding: "0.375rem 0.875rem" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{ fontSize: "0.875rem", padding: "0.4rem 1.125rem" }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
