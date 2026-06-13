// src/app/features/owner/components/EmptyVenues.tsx

"use client";

interface Props {
  onAdd: () => void;
}

export default function EmptyVenues({ onAdd }: Props) {
  return (
    <div className="owner-empty">
      <div className="owner-empty-illustration">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="30" width="60" height="40" rx="4" fill="var(--owner-accent-soft)" stroke="var(--owner-accent)" strokeWidth="2"/>
          <path d="M10 38h60" stroke="var(--owner-accent)" strokeWidth="2"/>
          <rect x="20" y="45" width="12" height="18" rx="2" fill="var(--owner-accent)" opacity="0.3"/>
          <rect x="44" y="45" width="16" height="10" rx="2" fill="var(--owner-accent)" opacity="0.3"/>
          <path d="M10 30L40 10l30 20" fill="var(--owner-accent-soft)" stroke="var(--owner-accent)" strokeWidth="2" strokeLinejoin="round"/>
          <circle cx="60" cy="58" r="14" fill="var(--owner-accent)"/>
          <line x1="60" y1="52" x2="60" y2="64" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="54" y1="58" x2="66" y2="58" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="owner-empty-title">No venues listed yet</h3>
      <p className="owner-empty-desc">
        Start by adding your first venue. It only takes a couple of minutes.
      </p>
      <button className="owner-btn-primary" onClick={onAdd}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        List Your First Venue
      </button>
    </div>
  );
}