import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 20, className, readOnly }: StarRatingProps) {
  const interactive = !!onChange && !readOnly;
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const StarEl = (
          <Star
            width={size}
            height={size}
            className={cn(
              "transition-colors",
              filled ? "fill-amber-400 stroke-amber-400" : "fill-transparent stroke-stone-300",
            )}
          />
        );
        return interactive ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            {StarEl}
          </button>
        ) : (
          <span key={n}>{StarEl}</span>
        );
      })}
    </div>
  );
}
