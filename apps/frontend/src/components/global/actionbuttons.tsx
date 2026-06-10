"use client";

export default function VenueFormActions() {
  return (
    <div className="sticky bottom-0 z-20 mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="h-11 rounded-lg border border-teal-600 px-5 text-sm font-medium text-teal-600 transition hover:bg-teal-50"
        >
          Save Draft
        </button>

        <button
          type="submit"
          className="h-11 rounded-lg bg-teal-600 px-5 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
