export default function FeaturedSectionSkeleton() {
  return (
    <section className="py-16 bg-transparent overflow-hidden relative w-full transition-colors duration-300 animate-pulse">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side Skeleton */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full relative z-10 space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="space-y-3 mt-4">
                <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
              <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
              <div className="space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
              </div>

              <div className="flex flex-wrap gap-2.5 pt-4">
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full w-28" />
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full w-24" />
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full w-32" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Right Side Skeleton */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            <div className="w-full aspect-[16/10] md:aspect-[16/9] lg:h-[380px] rounded-[32px] bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex gap-2 w-full px-2 mt-1">
              <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-1" />
              <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-1" />
              <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
