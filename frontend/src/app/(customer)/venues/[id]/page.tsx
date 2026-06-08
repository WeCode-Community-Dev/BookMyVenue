interface Props {
  params: Promise<{ id: string }>;
}
export default async function CustomerVenueDetailsPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Venue Details</h1>
      <p className="text-gray-600">Viewing details for venue ID: {id}</p>
    </div>
  );
}