import Link from "next/link";

export default async function CreateSpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href={`/my-venues/${id}`}
        className="text-sm text-surface-tint hover:underline"
      >
        &larr; Back to venue
      </Link>
      <h1 className="text-headline-md font-semibold text-on-surface">
        Add New Space
      </h1>
      <p className="text-sm text-on-surface-variant">Coming soon</p>
    </div>
  );
}
