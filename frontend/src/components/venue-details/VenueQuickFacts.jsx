import toast from "react-hot-toast";
import {
  Building2,
  IndianRupee,
  MapPin,
  Share2,
  Tag,
  Users,
} from "lucide-react";
import { formatBookingPriceDisplay } from "../../utils/formatPrice";
import { getVenueCityStateLabel } from "../../utils/venueLocation";
import { shareVenue } from "../../utils/shareVenue";
import { getCategoryLabel } from "../../utils/venueFilters";

const QuickFact = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/80 px-2.5 py-2">
    <Icon className="h-3.5 w-3.5 shrink-0 text-red-500" aria-hidden="true" />
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const VenueQuickFacts = ({ venue }) => {
  if (!venue) return null;

  const priceLabel = formatBookingPriceDisplay(venue.price);
  const locationLabel = getVenueCityStateLabel(venue);

  const handleShare = async () => {
    try {
      const result = await shareVenue({
        title: venue.title,
        url: window.location.href,
      });

      if (result.method === "clipboard") {
        toast.success("Link copied to clipboard");
      }
    } catch {
      toast.error("Unable to share this venue");
    }
  };

  return (
    <header className="mt-4 border-b border-gray-100 pb-4 sm:mt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {venue.title}
          </h1>

          <p className="mt-1.5 flex items-start gap-2 text-sm text-gray-600 sm:text-[15px]">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              aria-hidden="true"
            />
            <span>{locationLabel}</span>
          </p>

          <p className="mt-2 text-xl font-bold text-red-600 lg:hidden">
            {priceLabel}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <QuickFact
          icon={Users}
          label="Capacity"
          value={`Up to ${venue.capacity ?? "—"} guests`}
        />
        <QuickFact
          icon={Tag}
          label="Category"
          value={getCategoryLabel(venue.category)}
        />
        <QuickFact
          icon={Building2}
          label="Venue type"
          value={venue.venueType || "Not specified"}
        />
        <QuickFact
          icon={IndianRupee}
          label="Price"
          value={priceLabel}
        />
      </div>
    </header>
  );
};

export default VenueQuickFacts;
