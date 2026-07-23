export default function HostedBy({ vendor }) {
  if (!vendor) {
    return null;
  }

  const hostName =
    vendor.companyName || vendor.fullName || "Venue Host";

  const hostInitial =
    vendor.companyName?.charAt(0) ||
    vendor.fullName?.charAt(0) ||
    "V";

  return (
    <section className="mt-6 rounded-2xl border bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">Hosted By</h2>

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-bold">
            {hostInitial}
          </div>

          <div>
            <h3 className="text-lg font-bold">{hostName}</h3>

            <p className="mt-1 text-sm text-gray-500">
              Professional venue host
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {vendor.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-50"
        >
          Contact Host
        </button>
      </div>
    </section>
  );
}