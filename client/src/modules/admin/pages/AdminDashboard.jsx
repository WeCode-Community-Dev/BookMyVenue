import { useState } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import logo from "../../../assets/bookmyvenue.webp";

const STATS = [
  { label: "Total Venues", value: 142, icon: "🏛️", change: "+12 this month" },
  { label: "Total Users", value: 1840, icon: "👥", change: "+94 this month" },
  { label: "Total Bookings", value: 389, icon: "📅", change: "+27 this month" },
];

const USERS = [
  {
    id: "usr_01",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 9876543210",
    type: "USER",
    joined: "12 Jan 2026",
    status: "Active",
  },
  {
    id: "usr_02",
    name: "Rajesh Iyer",
    email: "rajesh@example.com",
    phone: "+91 9000000000",
    type: "OWNER",
    joined: "03 Feb 2026",
    status: "Active",
  },
  {
    id: "usr_03",
    name: "Aisha Khan",
    email: "aisha@example.com",
    phone: "+91 9123456789",
    type: "USER",
    joined: "18 Feb 2026",
    status: "Active",
  },
  {
    id: "usr_04",
    name: "Vikram Nair",
    email: "vikram@example.com",
    phone: "+91 9988776655",
    type: "OWNER",
    joined: "01 Mar 2026",
    status: "Suspended",
  },
  {
    id: "usr_05",
    name: "Sneha Patel",
    email: "sneha@example.com",
    phone: "+91 9012345678",
    type: "USER",
    joined: "15 Mar 2026",
    status: "Active",
  },
  {
    id: "usr_06",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    phone: "+91 9876001234",
    type: "USER",
    joined: "22 Apr 2026",
    status: "Active",
  },
  {
    id: "usr_07",
    name: "Divya Reddy",
    email: "divya@example.com",
    phone: "+91 9000112233",
    type: "OWNER",
    joined: "05 May 2026",
    status: "Active",
  },
  {
    id: "usr_08",
    name: "Mohammed Ali",
    email: "mali@example.com",
    phone: "+91 9876543000",
    type: "USER",
    joined: "20 May 2026",
    status: "Active",
  },
];

const NAV_ITEMS = [
  { label: "Overview", icon: "📊" },
  { label: "Users", icon: "👥" },
];

const BADGE_STYLES = {
  USER: { bg: "#EFF6FF", color: "#2563EB" },
  OWNER: { bg: "#F0FDF4", color: "#16A34A" },
  Active: { bg: "#F0FDF4", color: "#16A34A" },
  Suspended: { bg: "#FEF2F2", color: "#DC2626" },
};

const AVATAR_COLORS = [
  ["#DBEAFE", "#1D4ED8"],
  ["#DCF4E7", "#15803D"],
  ["#FEF9C3", "#A16207"],
  ["#FCE7F3", "#BE185D"],
  ["#EDE9FE", "#7C3AED"],
  ["#FFEDD5", "#C2410C"],
];

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [bg, color] = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.72rem",
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function Badge({ type }) {
  const s = BADGE_STYLES[type] || { bg: "#F3F4F6", color: "#374151" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: "0.7rem",
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 20,
        whiteSpace: "nowrap",
      }}
    >
      {type}
    </span>
  );
}

function StatCard({ label, value, icon, change }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #F3F4F6",
        borderRadius: 16,
        padding: "18px 20px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </p>
        <span style={{ fontSize: "1.2rem" }}>{icon}</span>
      </div>
      <p
        style={{
          fontSize: "1.8rem",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "#111",
          lineHeight: 1,
        }}
      >
        {value.toLocaleString()}
      </p>
      <p style={{ fontSize: "0.72rem", color: "#6B7280", marginTop: 8 }}>
        {change}
      </p>
    </div>
  );
}

function UserCard({ u }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #F3F4F6",
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={u.name} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111" }}>
            {u.name}
          </p>
          <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
            Joined {u.joined}
          </p>
        </div>
        <Badge type={u.status} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          paddingLeft: 42,
        }}
      >
        <p style={{ fontSize: "0.78rem", color: "#374151" }}>📧 {u.email}</p>
        <p style={{ fontSize: "0.78rem", color: "#374151" }}>📞 {u.phone}</p>
      </div>
      <div style={{ paddingLeft: 42 }}>
        <Badge type={u.type} />
      </div>
    </div>
  );
}

function Overview({ isMobile }) {
  return (
    <div>
      <h2
        style={{
          fontSize: "1.1rem",
          fontWeight: 800,
          marginBottom: 16,
          letterSpacing: "-0.02em",
        }}
      >
        Overview
      </h2>

      {/* Stat cards — stack on mobile */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent users */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid #F3F4F6",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: "0.88rem" }}>Recent Users</p>
          <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>
            Last 5 joined
          </span>
        </div>
        {USERS.slice(-5)
          .reverse()
          .map((u, i) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 18px",
                borderBottom: i < 4 ? "1px solid #F9FAFB" : "none",
                flexWrap: "wrap",
              }}
            >
              <Avatar name={u.name} />
              <div style={{ flex: 1, minWidth: 120 }}>
                <p
                  style={{
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    color: "#111",
                  }}
                >
                  {u.name}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#9CA3AF",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 180,
                  }}
                >
                  {u.email}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge type={u.type} />
                <Badge type={u.status} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function UsersTable({ isMobile }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = USERS.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (filter === "ALL" || u.type === filter)
    );
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Users
        </h2>
        <p style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>
          {filtered.length} of {USERS.length}
        </p>
      </div>

      <div
        style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
          style={{
            flex: 1,
            minWidth: 160,
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            padding: "8px 13px",
            fontSize: "0.83rem",
            fontFamily: "inherit",
            outline: "none",
            background: "#fff",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["ALL", "USER", "OWNER"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 13px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: filter === f ? "#111" : "#E5E7EB",
                background: filter === f ? "#111" : "#fff",
                color: filter === f ? "#fff" : "#374151",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#9CA3AF",
                fontSize: "0.85rem",
                padding: "30px 0",
              }}
            >
              No users found
            </p>
          ) : (
            filtered.map((u) => <UserCard key={u.id} u={u} />)
          )}
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1.5px solid #F3F4F6",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr",
              padding: "10px 18px",
              background: "#F9FAFB",
              borderBottom: "1px solid #F3F4F6",
            }}
          >
            {["User", "Email", "Phone", "Type", "Status"].map((h) => (
              <p
                key={h}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {h}
              </p>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p
              style={{
                padding: "36px 18px",
                textAlign: "center",
                color: "#9CA3AF",
                fontSize: "0.85rem",
              }}
            >
              No users found
            </p>
          ) : (
            filtered.map((u, i) => (
              <div
                key={u.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr",
                  padding: "12px 18px",
                  alignItems: "center",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #F9FAFB" : "none",
                  transition: "background 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#FAFAFA")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 0,
                  }}
                >
                  <Avatar name={u.name} />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.84rem",
                        fontWeight: 600,
                        color: "#111",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {u.name}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>
                      Joined {u.joined}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#374151",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    paddingRight: 8,
                  }}
                >
                  {u.email}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#374151" }}>
                  {u.phone}
                </p>
                <Badge type={u.type} />
                <Badge type={u.status} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [active, setActive] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const { user } = useAuth();

  const isAdmin = user?.roles?.includes("ADMIN");
  // console.log("AdminDashboard user:", user );

  useState(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  });
  const isMobile = width < 640;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Inter',sans-serif",
        background: "#F9FAFB",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#E5E7EB; border-radius:2px; }
      `}</style>

      {!isMobile && (
        <aside
          style={{
            width: 210,
            background: "#fff",
            borderRight: "1.5px solid #F3F4F6",
            display: "flex",
            flexDirection: "column",
            padding: "22px 12px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 8px 22px",
              borderBottom: "1px solid #F3F4F6",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 60,
                height: 30,
                background: "#111",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              {" "}
              <div className="w-20 h-auto bg-gray-900 rounded-[10px] flex items-center justify-center text-base">
                <img src={logo} alt="BookMyVenue" className="" />
              </div>
            </div>
            <div>
              <p
                style={{
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  letterSpacing: "-0.02em",
                }}
              >
                bookmyvenue
              </p>
              <p
                style={{
                  fontSize: "0.62rem",
                  color: "#9CA3AF",
                  fontWeight: 600,
                }}
              >
                Admin Panel
              </p>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_ITEMS.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: active === label ? "#ff3232" : "transparent",
                  color: active === label ? "#fff" : "#555",
                  fontSize: "0.86rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (active !== label) {
                    e.currentTarget.style.background = "#F3F4F6";
                    e.currentTarget.style.color = "#111";
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== label) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#555";
                  }
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          <div
            style={{
              marginTop: "auto",
              padding: "12px",
              background: "#F9FAFB",
              borderRadius: 12,
              border: "1px solid #F3F4F6",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#d63f3f",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                }}
              >
                A
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    color: "#000000",
                  }}
                >
                  {user?.name}
                </p>
                <p style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {isMobile && (
          <header
            style={{
              background: "#fff",
              borderBottom: "1.5px solid #F3F4F6",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  background: "#111",
                  borderRadius: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                }}
              >
                🏛
              </div>
              <p style={{ fontWeight: 800, fontSize: "0.88rem" }}>
                VenueVista Admin
              </p>
            </div>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: 20,
                    height: 2,
                    background: "#111",
                    borderRadius: 2,
                    transition: "all 0.2s",
                    transform: menuOpen
                      ? i === 0
                        ? "rotate(45deg) translate(4px,4px)"
                        : i === 2
                          ? "rotate(-45deg) translate(4px,-4px)"
                          : "scaleX(0)"
                      : "none",
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </header>
        )}

        {isMobile && menuOpen && (
          <div
            style={{
              background: "#fff",
              borderBottom: "1px solid #F3F4F6",
              padding: "8px 12px",
              flexShrink: 0,
            }}
          >
            {NAV_ITEMS.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActive(label);
                  setMenuOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: active === label ? "#111" : "transparent",
                  color: active === label ? "#fff" : "#374151",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  marginBottom: 4,
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        )}

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile ? "20px 14px" : "28px 32px",
          }}
        >
          {active === "Overview" && <Overview isMobile={isMobile} />}
          {active === "Users" && <UsersTable isMobile={isMobile} />}
        </main>

        {isMobile && (
          <nav
            style={{
              background: "#fff",
              borderTop: "1.5px solid #F3F4F6",
              display: "flex",
              flexShrink: 0,
            }}
          >
            {NAV_ITEMS.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "10px 0",
                  border: "none",
                  cursor: "pointer",
                  background: "transparent",
                  fontFamily: "inherit",
                  color: active === label ? "#111" : "#9CA3AF",
                  borderTop:
                    active === label
                      ? "2px solid #111"
                      : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                  {label}
                </span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
