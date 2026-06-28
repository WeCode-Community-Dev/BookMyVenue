"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DUMMY_REVIEWS } from "@/lib/data/public-venue-detail";
import {
  getVenueRating,
  getVenueReviewCount,
} from "@/lib/data/venue-detail";

const INITIAL_REVIEW_COUNT = 3;

export function VenueReviewsSection() {
  const [showAll, setShowAll] = useState(false);
  const rating = getVenueRating();
  const reviewCount = getVenueReviewCount();
  const displayedReviews = showAll
    ? DUMMY_REVIEWS
    : DUMMY_REVIEWS.slice(0, INITIAL_REVIEW_COUNT);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Star className="size-5 fill-amber-400 text-amber-400" />
        <h2 className="text-lg font-semibold text-on-surface">
          {rating} • {reviewCount} Reviews
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col gap-2 rounded-lg border border-outline-variant/40 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-on-surface">
                {review.author}
              </span>
              <span className="text-sm text-on-surface-variant">
                {review.date}
              </span>
              <span className="text-xs rounded-full bg-surface-container-low px-2 py-0.5 text-on-surface-variant">
                {review.eventType}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>

      {!showAll && DUMMY_REVIEWS.length > INITIAL_REVIEW_COUNT && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAll(true)}
        >
          Show all {reviewCount} reviews
        </Button>
      )}
    </section>
  );
}
