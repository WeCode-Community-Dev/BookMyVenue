import { ManageSpacePage } from "@/components/venues/manage-space/manage-space-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; spaceId: string }>;
}) {
  const { id, spaceId } = await params;

  return <ManageSpacePage venueId={id} spaceId={spaceId} />;
}
