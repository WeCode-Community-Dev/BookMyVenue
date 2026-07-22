export default function HostedBy({ vendor }) {
  if (!vendor) return null;

  return (
    <section className="bg-white rounded-2xl p-6 mt-6 border">
      <h2 className="text-2xl font-bold mb-6">
        Hosted By
      </h2>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
            {vendor.companyName?.charAt(0) ||
              vendor.fullName?.charAt(0) ||
              "V"}
          </div>

          <div>
            <h3 className="text-lg font-bold">
              {vendor.companyName || vendor.fullName}
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Professional venue host
            </p>

            <p className="text-gray-500 text-sm mt-1">
              {vendor.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="border border-gray-300 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50"
        >
          Contact Host
        </button>
      </div>
    </section>
  );
}