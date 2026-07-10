export default function VenueDetailsLoading() {
  return (
    <div className="flex h-[500px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted">Loading venue details...</p>
      </div>
    </div>
  );
}
