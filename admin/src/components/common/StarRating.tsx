export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < rating ? "text-yellow-500 text-xs" : "text-gray-300 text-xs"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}
