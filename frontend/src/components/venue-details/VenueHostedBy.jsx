import { BadgeCheck, CircleDot } from "lucide-react";
import { getVenueProvider } from "../../utils/venue";

const TrustBadge = ({ label }) => (
  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
    <BadgeCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
    {label}
  </span>
);

const ActiveBadge = ({ label }) => (
  <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
    <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
    {label}
  </span>
);

const VenueHostedBy = ({ venue }) => {
  const provider = getVenueProvider(venue);
  if (!provider) return null;

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-4 ring-1 ring-gray-100/80 sm:p-4">
      <h2 className="text-base font-semibold text-gray-900">Hosted by</h2>

      <div className="mt-3 flex items-center gap-3.5 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
        {provider.profileImage ? (
          <img
            src={provider.profileImage}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-red-100"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-white text-base font-bold text-red-600 ring-2 ring-red-100">
            {provider.initial}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-gray-900">
            {provider.name}
          </p>

          {provider.trustIndicators.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              {provider.trustIndicators.map((indicator) =>
                indicator.key === "active-host" ? (
                  <ActiveBadge key={indicator.key} label={indicator.label} />
                ) : (
                  <TrustBadge key={indicator.key} label={indicator.label} />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VenueHostedBy;
