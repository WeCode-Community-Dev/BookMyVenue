import VenueDetail from "@/src/customer/pages/VenueDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <VenueDetail id={resolvedParams.id} />;
}
