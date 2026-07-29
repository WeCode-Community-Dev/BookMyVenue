export default function EliteVenueSectionSkeleton() {
  return (
    <section className="bg-transparent text-foreground py-12 animate-pulse">
      <div className="max-w-6xl mx-auto px-6">
        {/* Centered Header matching Featured style */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-28" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-48" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-36" />
          </div>
        </div>

        <div className="mt-8 mb-12 border-t border-zinc-200 dark:border-zinc-800" />

        {/* Asymmetric Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Large Card (3/5 width) */}
          <div className="lg:col-span-3 relative rounded-[28px] overflow-hidden aspect-[4/3] lg:h-[500px] bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/40 flex flex-col justify-end p-8">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md w-28 mb-3" />
            <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-4" />
            <div className="flex items-center gap-4">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32" />
            </div>
          </div>

          {/* Right Column Stack (2/5 width) */}
          <div className="lg:col-span-2 flex flex-col gap-6 lg:h-[500px]">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 flex gap-4 p-4 rounded-[24px] bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/40 items-center min-h-[180px]"
              >
                <div className="w-1/3 aspect-[3/4] h-full rounded-2xl bg-zinc-200 dark:bg-zinc-800/80 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800/80 rounded w-3/4" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800/80 rounded w-1/2" />
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800/80 rounded w-1/3 pt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Column Bottom Promo Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/40 rounded-[24px] p-8 flex flex-col justify-between min-h-[260px]"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800/80" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800/80 rounded w-24" />
              </div>
              <div className="space-y-3 mt-8">
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800/80 rounded w-1/2" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800/80 rounded w-full" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800/80 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
