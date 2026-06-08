interface Props {
  params: Promise<{ id: string }>;
}
export default async function OwnerVenueDetailsPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit Venue</h1>
      <p className="text-gray-600">Managing venue ID: {id}</p>
    </div>
  );
}