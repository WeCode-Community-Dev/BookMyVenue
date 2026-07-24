import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, MapPin, Users, Calendar } from "lucide-react";
import { getVenueById, getVenueReviews } from "../services/venueService";
import BookingForm from "../../../components/BookingForm";
import { venueHasCancellationPolicy } from "../../../utils/cancellationPolicy";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
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
            s <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
    </div>
  );
}

function PhotoGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const photos = images?.length ? images : [];

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-slate-100 flex items-center justify-center text-slate-400 rounded-2xl">
        No photos available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl bg-slate-100">
        <img
          src={photos[activeIndex]}
          alt={`${name} photo ${activeIndex + 1}`}
          className="w-full aspect-[16/10] object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((url, idx) => (
            <button
              key={url + idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === activeIndex ? "border-blue-600" : "border-transparent"
              }`}
            >
              <img
                src={url}
                alt={`${name} thumbnail ${idx + 1}`}
                className="w-20 h-14 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 text-slate-500 shrink-0">{star} star</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-slate-500">{count}</span>
    </div>
  );
}

function CustomerReviewCard({ review }) {
  const colours = [
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
  ];
  const colour = colours[review.reviewer_name.charCodeAt(0) % colours.length];

  return (
    <div className="border border-slate-100 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${colour}`}
        >
          {getInitials(review.reviewer_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-slate-800">{review.reviewer_name}</p>
            <div className="flex items-center gap-2">
              {review.rating >= 4 && (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Top review
                </span>
              )}
              <p className="text-xs text-slate-400">{formatDate(review.created_at)}</p>
            </div>
          </div>
          <StarRating rating={review.rating} size={14} />
          {review.event_type && (
            <p className="text-xs text-slate-400 mt-1">Event: {review.event_type}</p>
          )}
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-slate-600 leading-relaxed">"{review.comment}"</p>
      )}

      {review.owner_reply && (
        <div className="bg-slate-50 rounded-lg p-3 border-l-2 border-blue-400">
          <p className="text-xs font-medium text-slate-500 mb-1">Owner response</p>
          <p className="text-sm text-slate-600">"{review.owner_reply}"</p>
          {review.replied_at && (
            <p className="text-xs text-slate-400 mt-1">{formatDate(review.replied_at)}</p>
          )}
        </div>
      )}
    </div>
  );
}

function VenueDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [venue, setVenue] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVenue = async () => {
      setLoading(true);
      setError("");
      try {
        const [venueData, reviews] = await Promise.all([
          getVenueById(id),
          getVenueReviews(id),
        ]);
        setVenue(venueData);
        setReviewsData(reviews);
      } catch (err) {
        setError(err.message || "Venue not found");
      } finally {
        setLoading(false);
      }
    };
    loadVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] p-6 text-center">
        <p className="text-rose-600">{error || "Venue not found"}</p>
        <Link to="/venues" className="text-sm text-blue-600 mt-2 inline-block">
          Back to venues
        </Link>
      </div>
    );
  }

  const images = venue.images?.length
    ? venue.images.map((image) => image?.url ?? image)
    : venue.image_url
      ? [venue.image_url]
      : [];
  const totalReviews = reviewsData?.total_reviews ?? venue.total_reviews ?? 0;
  const averageRating = reviewsData?.average_rating ?? venue.average_rating ?? 0;
  const reviews = reviewsData?.reviews ?? [];
  const distribution = reviewsData?.rating_distribution ?? {};

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link to="/venues" className="text-sm text-blue-600 hover:underline">
          ← Back to venues
        </Link>

        <div className="mt-4 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{venue.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1 text-sm">
                <MapPin size={14} />
                {venue.location}
              </span>
              {venue.google_maps_url && (
                <a
                  href={venue.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Open in Google Maps
                </a>
              )}
              {venue.venue_type && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                  {venue.venue_type.name}
                </span>
              )}
              {totalReviews > 0 && (
                <span className="flex items-center gap-1.5 text-sm">
                  <StarRating rating={averageRating} size={14} />
                  <span className="font-medium text-slate-700">
                    {Number(averageRating).toFixed(1)}
                  </span>
                  <span>({totalReviews} review{totalReviews !== 1 ? "s" : ""})</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photos */}
              <section className="bg-white rounded-2xl border border-slate-100 p-4">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Photos</h2>
                <PhotoGallery images={images} name={venue.name} />
              </section>

              {/* Details */}
              <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-slate-800">About this venue</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 mb-1">Price</p>
                    <p className="text-lg font-bold text-slate-800">
                      ₹{Number(venue.price_per_day).toLocaleString("en-IN")}
                      <span className="text-sm font-normal text-slate-400"> /day</span>
                    </p>
                  </div>
                  {venue.capacity && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Users size={12} /> Capacity
                      </p>
                      <p className="text-lg font-bold text-slate-800">{venue.capacity} guests</p>
                    </div>
                  )}
                  {venue.created_at && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Calendar size={12} /> Listed
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {formatDate(venue.created_at)}
                      </p>
                    </div>
                  )}
                </div>

                {venue.description && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Description</p>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {venue.description}
                    </p>
                  </div>
                )}

                {venue.amenities?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.map((a) => (
                        <span
                          key={a.id}
                          className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full"
                        >
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {venueHasCancellationPolicy(venue) && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Cancellation policy</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>
                        100% refund when cancelled at least {venue.refund_50_days_before} days before check-in
                      </li>
                      <li>
                        50% refund when cancelled at least {venue.refund_25_days_before} days before check-in
                      </li>
                      <li>
                        25% refund when cancelled at least {venue.cancel_cutoff_days_before} days before check-in
                      </li>
                      <li className="text-slate-400 text-xs pt-1">
                        Cancellation is not available within {venue.cancel_cutoff_days_before} days of check-in.
                      </li>
                    </ul>
                  </div>
                )}
              </section>

              {/* Reviews */}
              <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-slate-800">Customer reviews</h2>

                {totalReviews > 0 ? (
                  <>
                    <div className="flex flex-col sm:flex-row gap-6 pb-5 border-b border-slate-100">
                      <div className="text-center sm:text-left shrink-0">
                        <p className="text-4xl font-bold text-slate-800">
                          {Number(averageRating).toFixed(1)}
                        </p>
                        <StarRating rating={averageRating} size={18} />
                        <p className="text-sm text-slate-400 mt-1">
                          {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <RatingBar
                            key={star}
                            star={star}
                            count={distribution[String(star)] ?? 0}
                            total={totalReviews}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <CustomerReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    No reviews yet. Be the first to book and share your experience.
                  </p>
                )}
              </section>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                {isAuthenticated ? (
                  <BookingForm venueId={venue.id} pricePerDay={venue.price_per_day} />
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
                    <p className="text-2xl font-bold text-slate-800 mb-1">
                      ₹{Number(venue.price_per_day).toLocaleString("en-IN")}
                      <span className="text-sm font-normal text-slate-400"> /day</span>
                    </p>
                    <p className="text-slate-600 mb-4 mt-3">Sign in to book this venue</p>
                    <Link
                      to="/login"
                      className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium"
                    >
                      Login to book
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenueDetailPage;
