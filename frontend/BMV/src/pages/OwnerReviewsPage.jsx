import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Reply, Edit2, Share2, Flag, Trophy } from "lucide-react";
import {
  fetchOwnerReviewsAsync,
  submitReplyAsync,
  clearReplyError,
} from "../modules/reviews/reviewSlice";
import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";


function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}


function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= rating
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

function Avatar({ name }) {
  const colours = [
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
  ];
  const idx = name.charCodeAt(0) % colours.length;
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${colours[idx]}`}
    >
      {getInitials(name)}
    </div>
  );
}

function RatingBar({ star, pct }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-10 text-gray-500 shrink-0">{star} Star</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-800 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-600 font-medium">{pct}%</span>
    </div>
  );
}


function ReviewCard({ review }) {
  const dispatch = useDispatch();
  const { replyError } = useSelector((state) => state.reviews);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState(review.owner_reply || "");
  const [isSavingThis, setIsSavingThis] = useState(false);

  const isEditing = !!review.owner_reply;

  async function handleSave() {
    if (!replyText.trim()) return;
    setIsSavingThis(true);
    const result = await dispatch(
      submitReplyAsync({ reviewId: review.id, replyText: replyText.trim() })
    );
    setIsSavingThis(false);
    if (submitReplyAsync.fulfilled.match(result)) {
      setShowReplyBox(false);
    }
  }

  function handleCancel() {
    setShowReplyBox(false);
    setReplyText(review.owner_reply || "");
    dispatch(clearReplyError());
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={review.reviewer_name} />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {review.reviewer_name}
            </p>
            <p className="text-xs font-medium text-rose-800 uppercase tracking-wide mt-0.5">
              AT {review.venue_name}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StarRating rating={review.rating} />
          <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          "{review.comment}"
        </p>
      )}

      {/* Existing reply */}
      {review.owner_reply && !showReplyBox && (
        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Reply size={13} className="text-gray-400" />
            You replied:
          </p>
          <p className="text-sm text-gray-600">"{review.owner_reply}"</p>
        </div>
      )}

      {/* Reply input */}
      {showReplyBox && (
        <div className="mt-4 space-y-2">
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply…"
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition"
          />
          {!isSavingThis && replyError && (
            <p className="text-xs text-red-500">{replyError}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSavingThis || !replyText.trim()}
              className="px-4 py-1.5 text-sm font-medium bg-rose-800 text-white rounded-lg hover:bg-rose-900 disabled:opacity-50 transition"
            >
              {isSavingThis ? "Saving…" : "Save Reply"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!showReplyBox && (
            <button
              onClick={() => setShowReplyBox(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-rose-800 transition"
            >
              {isEditing ? (
                <><Edit2 size={13} /> Edit Reply</>
              ) : (
                <><Reply size={13} /> Reply</>
              )}
            </button>
          )}
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition">
            <Flag size={13} /> Report
          </button>
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition">
          <Share2 size={15} />
        </button>
      </div>
    </div>
  );
}


function ReviewOfMonth({ review }) {
  if (!review) return null;
  return (
    <div className="bg-rose-900 text-white rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={15} className="text-amber-400" />
        <p className="text-xs font-bold tracking-widest uppercase text-amber-400">
          Review of the Month
        </p>
      </div>
      <StarRating rating={review.rating} size={14} />
      {review.comment && (
        <p className="mt-3 text-sm text-rose-100 leading-relaxed italic">
          "{review.comment}"
        </p>
      )}
      <div className="mt-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-rose-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {getInitials(review.reviewer_name)}
        </div>
        <div>
          <p className="text-sm font-semibold">{review.reviewer_name}</p>
          <p className="text-xs text-rose-300">{review.venue_name}</p>
        </div>
      </div>
    </div>
  );
}


export default function OwnerReviewsPage() {
  const dispatch = useDispatch();
  const {
    reviews,
    ratingDistribution,
    totalReviews,
    averageRating,
    reviewOfMonth,
    isLoading,
    error,
  } = useSelector((state) => state.reviews);

  const [filterVenue, setFilterVenue] = useState("all");
  const [filterStar, setFilterStar] = useState("all");

  useEffect(() => {
    dispatch(fetchOwnerReviewsAsync());
  }, [dispatch]);

  const venueOptions = useMemo(() => {
    return [...new Set(reviews.map((r) => r.venue_name))];
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const venueMatch = filterVenue === "all" || r.venue_name === filterVenue;
      const starMatch = filterStar === "all" || r.rating === Number(filterStar);
      return venueMatch && starMatch;
    });
  }, [reviews, filterVenue, filterStar]);

  if (isLoading) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          Loading reviews…
        </div>
      </OwnerLayout>
    );
  }

  if (error) {
    return (
      <OwnerLayout>
        <div className="flex items-center justify-center h-64 text-red-500 text-sm">
          {error}
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""} · {averageRating} average rating
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Left: review list ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Filter bar */}
          <div className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">Recent Feedback</p>
            <div className="flex items-center gap-2">
              <select
                value={filterVenue}
                onChange={(e) => setFilterVenue(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-200 cursor-pointer"
              >
                <option value="all">All Venues</option>
                {venueOptions.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>

              <select
                value={filterStar}
                onChange={(e) => setFilterStar(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-200 cursor-pointer"
              >
                <option value="all">All Ratings</option>
                {[5, 4, 3, 2, 1].map((s) => (
                  <option key={s} value={s}>{s} Star</option>
                ))}
              </select>
            </div>
          </div>

          {/* Review cards */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-400 text-sm shadow-sm">
              No reviews match the selected filters.
            </div>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>

        {/* ── Right: stats panel ── */}
        <div className="w-72 shrink-0 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-4">Rating Distribution</p>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar
                  key={star}
                  star={star}
                  pct={ratingDistribution?.[String(star)] ?? 0}
                />
              ))}
            </div>
          </div>

          <ReviewOfMonth review={reviewOfMonth} />
        </div>
      </div>
    </div>
    </OwnerLayout>
  );
}