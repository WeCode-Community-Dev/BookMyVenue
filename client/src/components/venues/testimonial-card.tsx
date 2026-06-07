// src/components/venues/testimonial-card.tsx
import { TestimonialCardProps } from "@/src/types/global";
import { Star } from "lucide-react";

export function TestimonialCard({ review }: TestimonialCardProps) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300">
      
      <div>
        <div className="flex items-center gap-0.5 mb-4">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index < review.rating 
                  ? "fill-black text-black" 
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>

        <p className="text-gray-700 text-sm italic leading-relaxed mb-6">
          "{review.comment}"
        </p>
      </div>
      
      <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center gap-3">
          <img
            src={review.avatarUrl}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover bg-gray-200"
          />
          <div>
            <h5 className="text-sm font-bold text-gray-900">{review.name}</h5>
            <p className="text-[11px] text-gray-400 font-medium">{review.role}</p>
          </div>
        </div>

        <span className="text-[11px] bg-white border border-gray-200 text-gray-600 font-semibold px-2.5 py-1 rounded-md max-w-[140px] truncate">
          Booked: {review.venueName}
        </span>
      </div>

    </div>
  );
}