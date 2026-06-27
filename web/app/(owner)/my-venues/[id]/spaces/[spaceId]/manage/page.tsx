import Link from "next/link";

export default async function ManageSpacePage({
  params,
}: {
  params: Promise<{ id: string; spaceId: string }>;
}) {
  const { id, spaceId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={`/my-venues/${id}`}
        className="text-sm text-surface-tint hover:underline"
      >
        &larr; Back to venue
      </Link>
      <h1 className="text-headline-md font-semibold text-on-surface">
        Manage Space
      </h1>
      <p className="text-sm text-on-surface-variant">
        Space ID: {spaceId} — Coming soon
      </p>
    </div>
  );
}
