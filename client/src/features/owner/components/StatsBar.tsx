// src/app/features/owner/components/StatsBar.tsx

"use client";

import { VenueStats } from "../type";

interface Props {
  stats: VenueStats;
}

export default function StatsBar({ stats }: Props) {
  const cards = [
    {
      label: "Total Venues",
      value: stats.total,
      color: "var(--owner-accent)",
      bg: "var(--owner-accent-soft)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Active",
      value: stats.active,
      color: "#22c55e",
      bg: "#f0fdf4",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Pending Review",
      value: stats.pending,
      color: "#f59e0b",
      bg: "#fffbeb",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Inactive",
      value: stats.inactive,
      color: "#94a3b8",
      bg: "#f8fafc",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
    },
  ];

  return (
    <div className="owner-stats-bar">
      {cards.map((c) => (
        <div key={c.label} className="owner-stat-card" style={{ "--stat-color": c.color, "--stat-bg": c.bg } as React.CSSProperties}>
          <div className="owner-stat-icon">{c.icon}</div>
          <div className="owner-stat-body">
            <span className="owner-stat-value">{c.value}</span>
            <span className="owner-stat-label">{c.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}