import {
  Car,
  CheckCircle2,
  Coffee,
  Mic2,
  Projector,
  ShieldCheck,
  Snowflake,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";

const AMENITY_ICONS = [
  { match: /wifi|internet/i, icon: Wifi },
  { match: /parking|car/i, icon: Car },
  { match: /ac|air/i, icon: Snowflake },
  { match: /cater|food|kitchen/i, icon: UtensilsCrossed },
  { match: /sound|audio|mic/i, icon: Mic2 },
  { match: /projector|screen/i, icon: Projector },
  { match: /security/i, icon: ShieldCheck },
  { match: /coffee|tea/i, icon: Coffee },
];

const getAmenityIcon = (amenity) => {
  const match = AMENITY_ICONS.find((entry) => entry.match.test(amenity));
  return match?.icon ?? CheckCircle2;
};

const VenueAmenities = ({ amenities }) => {
  if (!Array.isArray(amenities) || amenities.length === 0) return null;

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-4 ring-1 ring-gray-100/80">
      <h2 className="text-base font-semibold text-gray-900">Amenities</h2>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {amenities.map((amenity) => {
          const Icon = getAmenityIcon(amenity);

          return (
            <span
              key={amenity}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50/80 px-2.5 py-1.5 text-sm text-gray-700"
            >
              <Icon className="h-3.5 w-3.5 text-red-500" aria-hidden="true" />
              {amenity}
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default VenueAmenities;
