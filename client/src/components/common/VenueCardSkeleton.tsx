interface VenueCardSkeletonProps {
  count?: number;
}

const VenueCardSkeleton = ({ count = 3 }: VenueCardSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-[var(--bg-grey)] h-96 animate-pulse flex flex-col"
        >
          {/* Image placeholder */}
          <div className="h-48 bg-gray-200 w-full rounded-t-2xl" />

          <div className="p-5 flex-1 flex flex-col gap-3">
            {/* Title placeholder */}
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            {/* Subtitle placeholder */}
            <div className="h-4 bg-gray-200 rounded w-1/2" />

            {/* Button row placeholder */}
            <div className="mt-auto flex gap-3">
              <div className="h-10 bg-gray-200 rounded flex-1" />
              <div className="h-10 bg-gray-200 rounded flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VenueCardSkeleton;
