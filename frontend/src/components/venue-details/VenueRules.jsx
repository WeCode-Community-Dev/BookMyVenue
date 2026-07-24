import { Check } from "lucide-react";

const VenueRules = ({ rules }) => {
  if (!Array.isArray(rules) || rules.length === 0) return null;

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-4 ring-1 ring-gray-100/80">
      <h2 className="text-base font-semibold text-gray-900">Venue rules</h2>

      <ul className="mt-2.5 space-y-2">
        {rules.map((rule) => (
          <li key={rule} className="flex gap-2.5 text-sm text-gray-700">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              aria-hidden="true"
            />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default VenueRules;
