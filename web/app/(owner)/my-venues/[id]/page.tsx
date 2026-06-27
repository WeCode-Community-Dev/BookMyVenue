import { VenueDetailPage } from "@/components/venues/detail/venue-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VenueDetailPage venueId={id} />;
}
