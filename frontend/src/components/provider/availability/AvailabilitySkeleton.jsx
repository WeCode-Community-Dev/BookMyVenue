const AvailabilitySkeleton = ({ count = 4 }) => (
  <div className="space-y-3" aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-xl border border-gray-200 bg-white p-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-gray-100" />
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="h-3 w-32 rounded bg-gray-100" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-gray-100" />
            <div className="h-8 w-24 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AvailabilitySkeleton;
