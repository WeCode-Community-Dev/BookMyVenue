"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "4rem 1.5rem",
        }}
      >
        {/* Background glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "20%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "0%",
            right: "10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "760px",
            textAlign: "center",
            animation: "fadeInUp 0.7s ease forwards",
          }}
        >
          {/* Pill badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 1rem",
              background: "rgba(99,102,241,0.14)",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: "9999px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--accent-300)",
              marginBottom: "1.75rem",
              letterSpacing: "0.03em",
            }}
          >
            <span>✨</span>
            Open Source · Built by WeCode Community
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.25rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              marginBottom: "1.5rem",
              background:
                "linear-gradient(135deg, #f0f2ff 30%, #a5b4fc 70%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Find Your Perfect
            <br />
            Venue in Minutes
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto 2.5rem",
            }}
          >
            Discover and book unique spaces for meetings, weddings, parties, and
            everything in between — completely free, powered by community.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/venues" className="btn btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1.0625rem" }}>
              🔍 Browse Venues
            </Link>
            <Link href="/register" className="btn btn-outline" style={{ padding: "0.875rem 2rem", fontSize: "1.0625rem" }}>
              Create Account
            </Link>
          </div>

          {/* Social proof */}
          <p
            style={{
              marginTop: "2.5rem",
              fontSize: "0.875rem",
              color: "var(--text-muted)",
            }}
          >
            🎉 10+ curated venues · 7 categories · Instant booking
          </p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 1.5rem",
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-card)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                marginBottom: "0.75rem",
              }}
            >
              Why BookMyVenue?
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.0625rem",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              Everything you need to find and book the perfect space, hassle-free.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: "🗺️",
                title: "Centralised Marketplace",
                desc: "One platform to discover hundreds of venues — from corporate boardrooms to scenic outdoor lawns.",
                color: "#6366f1",
              },
              {
                icon: "⚡",
                title: "Instant Booking",
                desc: "Real-time availability and upfront pricing. Book in just a few clicks, no back-and-forth needed.",
                color: "#10b981",
              },
              {
                icon: "🔍",
                title: "Verified Listings",
                desc: "High-quality photos, comprehensive amenity lists, and transparent reviews from real attendees.",
                color: "#f59e0b",
              },
              {
                icon: "💸",
                title: "Always Free",
                desc: "BookMyVenue is a community-driven open source project — no commissions, no hidden fees, ever.",
                color: "#ec4899",
              },
              {
                icon: "🤝",
                title: "Empower Owners",
                desc: "Local cafes, studios, and community halls get a free platform to share underused spaces.",
                color: "#8b5cf6",
              },
              {
                icon: "📱",
                title: "Beautiful & Fast",
                desc: "A modern, responsive interface that feels great on any device, any screen size.",
                color: "#14b8a6",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.75rem",
                  animation: `fadeInUp ${0.4 + i * 0.08}s ease forwards`,
                  opacity: 0,
                  transition: "transform 0.25s, border-color 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = `${feature.color}44`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border-card)";
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `${feature.color}20`,
                    border: `1px solid ${feature.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    marginBottom: "1.125rem",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "var(--bg-base)",
          borderTop: "1px solid var(--border-card)",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.22), rgba(139,92,246,0.14))",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "var(--radius-xl)",
            padding: "3.5rem 2rem",
            boxShadow: "0 0 60px rgba(99,102,241,0.12)",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "0.875rem",
            }}
          >
            Ready to find your space?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.0625rem",
              marginBottom: "2rem",
              maxWidth: "420px",
              margin: "0 auto 2rem",
            }}
          >
            Join the WeCode community and start exploring venues today.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/register" className="btn btn-primary" style={{ padding: "0.8rem 1.875rem" }}>
              Get Started — It&apos;s Free
            </Link>
            <Link href="/venues" className="btn btn-outline" style={{ padding: "0.8rem 1.875rem" }}>
              Browse Venues
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-card)",
          padding: "1.5rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.8375rem",
        }}
      >
        BookMyVenue · Open Source by{" "}
        <span style={{ color: "var(--accent-400)" }}>WeCode Community</span> · MIT
        License
      </footer>
    </div>
  );
}
