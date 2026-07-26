import { Star } from "lucide-react";

export default function ProTipCard() {
  return (
    <div className=" mt-8 rounded-2xl border border-slate-200 bg-sky-50 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Star
          className="h-5 w-5 fill-yellow-400 text-yellow-400"
        />

        <h3 className="font-semibold text-slate-900">
          Pro Tip
        </h3>
      </div>

      <p className="mb-4 text-sm leading-6 text-slate-600">
        Keep your venue calendar updated to get more
        bookings.
      </p>

      <button className="font-medium text-teal-600 hover:text-teal-700">
        Update Availability →
      </button>
    </div>
  );
}