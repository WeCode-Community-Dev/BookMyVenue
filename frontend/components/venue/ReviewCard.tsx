import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    userName: string;
    avatar: string;
    rating: number;
    date: string;
    text: string;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition duration-200">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative size-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={review.avatar}
            alt={`${review.userName}'s profile`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
            {review.userName}
          </h4>
          <span className="text-[11px] font-medium text-slate-400 select-none block">
            {review.date}
          </span>
        </div>
      </div>

      {/* Stars & Text */}
      <div className="space-y-1">
        <div className="flex items-center gap-0.5 select-none" aria-label={`Rating: ${review.rating} stars`}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`size-3.5 ${
                idx < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
              }`}
            />
          ))}
        </div>
        <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed line-clamp-4">
          {review.text}
        </p>
      </div>
    </div>
  );
}
