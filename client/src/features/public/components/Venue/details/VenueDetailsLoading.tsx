export default function VenueDetailsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-muted/30 rounded-lg" />
        <div className="h-10 w-2/3 bg-muted/40 rounded-2xl" />
        <div className="h-5 w-48 bg-muted/30 rounded-lg" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Gallery & Sections skeleton */}
        <div className="space-y-8">
          <div className="h-[460px] w-full bg-muted/30 rounded-3xl" />
          <div className="space-y-3 py-6 border-b border-border/40">
            <div className="h-6 w-40 bg-muted/40 rounded-lg" />
            <div className="h-4 w-full bg-muted/20 rounded-lg" />
            <div className="h-4 w-5/6 bg-muted/20 rounded-lg" />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="h-[400px] bg-muted/30 rounded-3xl" />
      </div>
    </div>
  );
}
