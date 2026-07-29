export default function CategoriesSectionSkeleton() {
  return (
    <section className="bg-transparent text-foreground py-16 relative overflow-hidden animate-pulse">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2 mt-2">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800" />

        {/* Grid Skeleton */}
        <div className="flex flex-col md:flex-row gap-5 h-[700px] md:h-[500px] w-full mt-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[32px] border border-zinc-200 dark:border-zinc-800/40 bg-zinc-100 dark:bg-zinc-900/60 flex-1 flex flex-col justify-between p-8"
            >
              <div className="flex justify-between items-start">
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800/80 rounded w-10" />
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-24" />
              </div>
              <div className="space-y-3">
                <div className="h-7 bg-zinc-200 dark:bg-zinc-800/80 rounded w-3/4" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800/80 rounded w-5/6" />
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800/80 rounded w-1/3 pt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
