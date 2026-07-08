import { Skeleton } from '@/components/ui/Skeleton';

export function VenueCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-brand-border bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
