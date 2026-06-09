import { Plus } from "lucide-react";

export default function AddVenueCard() {
  return (
    <div className="h-[360px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-teal-600">
          <Plus className="h-8 w-8 text-teal-600" />
        </div>

        <h3 className="mb-3 text-[16px] font-semibold text-slate-900">
          Add New Venue
        </h3>

        <p className="max-w-[220px] text-sm leading-6 text-slate-500">
          List another amazing venue and start getting bookings.
        </p>
      </div>
    </div>
  );
}