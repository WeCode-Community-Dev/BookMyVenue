export function BookingsPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline-md font-semibold text-on-surface">
          Bookings
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          View and manage all bookings across your venues.
        </p>
      </div>
    </div>
  );
}
