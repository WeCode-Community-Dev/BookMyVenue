export default function ExploreVenuesSectionSkeleton() {
  return (
    <section className="bg-transparent text-foreground py-12 animate-pulse">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header matching Featured style */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-28" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-48" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-36" />
          </div>
        </div>

        <div className="mt-8 mb-10 border-t border-zinc-200 dark:border-zinc-800" />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column - Map Skeleton */}
          <div className="lg:col-span-7 flex flex-col p-6 md:p-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/60 rounded-[32px] shadow-lg min-h-[460px] justify-between">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-32" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-40" />
            </div>

            {/* Map Placeholder */}
            <div className="flex-1 min-h-[320px] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

            {/* Simple Map Legend */}
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-900">
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
            </div>
          </div>

          {/* Right Column - Directory List Skeleton */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-card border border-zinc-200/40 dark:border-zinc-800/80 rounded-[32px] p-6 md:p-8 shadow-xl min-h-[460px]">
            {/* Header of details */}
            <div className="mb-4 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3 flex-1">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                </div>

                {/* District quick toggles */}
                <div className="flex gap-1">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-10" />
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-10" />
                </div>
              </div>

              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 my-4" />

            {/* Venues scrollable area */}
            <div className="flex-1 space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/20 dark:border-zinc-800/40"
                >
                  {/* Left Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />

                  {/* Right Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                    </div>

                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
