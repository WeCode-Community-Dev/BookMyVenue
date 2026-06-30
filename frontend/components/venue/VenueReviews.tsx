import React from "react";
import { Star } from "lucide-react";
import VenueSection from "./VenueSection";
import ReviewCard from "./ReviewCard";

interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

interface VenueReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export default function VenueReviews({ reviews, rating, reviewCount }: VenueReviewsProps) {
  // Mock individual scoring categories for visual detail
  const ratingCategories = [
    { name: "Cleanliness", score: 4.9 },
    { name: "Accuracy", score: 4.8 },
    { name: "Communication", score: 4.9 },
    { name: "Location", score: 4.7 },
    { name: "Value for Money", score: 4.8 },
    { name: "Facilities", score: 4.9 },
  ];

  return (
    <VenueSection title="" id="reviews" className="py-8">
      {/* Reviews Summary Header */}
      <div className="flex items-center gap-2 mb-6 select-none">
        <Star className="size-6 fill-amber-400 text-amber-400" />
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {rating.toFixed(1)} <span className="text-slate-400 font-bold">·</span> {reviewCount} Reviews
        </h2>
      </div>

      {/* Ratings Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12 mb-8 select-none">
        {ratingCategories.map((category, idx) => (
          <div key={idx} className="flex items-center justify-between py-1 text-slate-700 font-semibold text-sm">
            <span className="text-slate-600 font-medium text-xs sm:text-sm">{category.name}</span>
            <div className="flex items-center gap-3 w-1/2 justify-end">
              {/* Progress bar container */}
              <div className="relative w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden xs:block">
                <div
                  className="absolute left-0 top-0 h-full bg-slate-900 rounded-full"
                  style={{ width: `${(category.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-black text-slate-900 w-5 text-right">
                {category.score.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </VenueSection>
  );
}
