import Link from "next/link";
import Image from "next/image";
import { Venue } from "@/lib/venues";
import { formatPrice } from "@/lib/bookings";

interface VenueCardProps {
  venue: Venue;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: "0.75rem",
            color: star <= Math.round(rating) ? "#fbbf24" : "var(--text-muted)",
          }}
        >
          ★
        </span>
      ))}
      <span
        style={{
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          marginLeft: "0.15rem",
        }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Conference: "#6366f1",
  Wedding:    "#ec4899",
  Party:      "#f59e0b",
  Outdoor:    "#10b981",
  Workshop:   "#3b82f6",
  Exhibition: "#8b5cf6",
  Sports:     "#14b8a6",
};

export default function VenueCard({ venue }: VenueCardProps) {
  const accentColor = CATEGORY_COLORS[venue.category] ?? "#6366f1";

  return (
    <Link href={`/venues/${venue.id}`} style={{ display: "block", textDecoration: "none" }}>
      <div
        className="card"
        style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Hero Image */}
        <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
          <Image
            src={venue.images[0]}
            alt={venue.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
            }}
          />
          {/* Category badge overlay */}
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
            }}
          >
            <span
              className="badge"
              style={{
                background: `${accentColor}25`,
                color: accentColor,
                border: `1px solid ${accentColor}55`,
                backdropFilter: "blur(8px)",
              }}
            >
              {venue.category}
            </span>
          </div>
          {/* Price overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "0.75rem",
              right: "0.75rem",
              background: "rgba(13,15,26,0.85)",
              backdropFilter: "blur(8px)",
              padding: "0.25rem 0.625rem",
              borderRadius: "9999px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            {formatPrice(venue.pricePerHour)}/hr
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.125rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {/* Name & Rating */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
            <h3
              style={{
                fontSize: "1.0625rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {venue.name}
            </h3>
            <StarRating rating={venue.rating} />
          </div>

          {/* Location */}
          <p style={{ fontSize: "0.8375rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span>📍</span>
            {venue.location}
          </p>

          {/* Capacity */}
          <p style={{ fontSize: "0.8375rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span>👥</span>
            Up to {venue.capacity} guests
          </p>

          {/* Amenities preview */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.25rem" }}>
            {venue.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                style={{
                  padding: "0.15rem 0.5rem",
                  background: "var(--bg-elevated)",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-card)",
                }}
              >
                {a}
              </span>
            ))}
            {venue.amenities.length > 3 && (
              <span
                style={{
                  padding: "0.15rem 0.5rem",
                  background: "var(--bg-elevated)",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-card)",
                }}
              >
                +{venue.amenities.length - 3}
              </span>
            )}
          </div>

          {/* CTA */}
          <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
            <div
              className="btn btn-outline"
              style={{ width: "100%", fontSize: "0.875rem", padding: "0.5rem" }}
            >
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
