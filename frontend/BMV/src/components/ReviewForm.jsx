import { useState } from "react";
import { createReview } from "../modules/reviews/services/reviewService";

function StarPicker({ value, onChange, disabled }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className={`text-2xl transition ${
            star <= value ? "text-amber-400" : "text-slate-200"
          } disabled:opacity-50`}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ venueId, bookingId, googleMapsUrl, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createReview({
        venue_id: venueId,
        booking_id: bookingId,
        rating,
        comment: comment.trim() || null,
      });
      setSubmittedRating(rating);
      if (rating >= 4 && googleMapsUrl) {
        setShowGooglePrompt(true);
      }
      onSuccess?.({ rating });
    } catch (err) {
      setError(err.message || "Could not submit review.");
    } finally {
      setLoading(false);
    }
  };

  if (showGooglePrompt) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
        <p className="text-sm font-medium text-emerald-800">
          Thank you for your {submittedRating}-star review!
        </p>
        <p className="text-sm text-emerald-700">
          Would you also like to share your experience on Google Maps?
        </p>
        <div className="flex gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Rate on Google Maps
          </a>
          <button
            type="button"
            onClick={() => setShowGooglePrompt(false)}
            className="rounded-xl border border-emerald-200 px-4 py-2 text-sm text-emerald-700 hover:bg-white"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (submittedRating > 0 && !(submittedRating >= 4 && googleMapsUrl)) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-medium text-emerald-800">
          Thank you! Your review has been submitted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Your rating</p>
        <StarPicker value={rating} onChange={setRating} disabled={loading} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          disabled={loading}
          placeholder="Tell others about your experience"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
        />
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || rating < 1}
        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}

export default ReviewForm;
