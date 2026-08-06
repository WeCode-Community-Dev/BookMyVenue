import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import EmptyState from "../shared/EmptyState";

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function RecentReviews({ reviews, loading }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-rose-900">Recent Reviews</h3>
        <Link to="/owner/reviews" className="text-xs font-medium text-rose-700 hover:underline">
          All reviews
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Share your venue links to collect customer feedback."
          actionLabel="View reviews page"
          actionTo="/owner/reviews"
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center text-xs font-semibold shrink-0">
                {initials(r.reviewer_name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800">{r.reviewer_name}</p>
                  <span className="flex items-center gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                        }
                      />
                    ))}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                  {r.comment}
                </p>
                {r.date && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    {r.event_type} on{" "}
                    {new Date(r.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentReviews;
