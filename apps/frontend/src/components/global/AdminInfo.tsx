// components/admin/AdminBottomSection.tsx

import {
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export default function AdminBottomSection() {
  const guidelines = [
    "Check venue details and description",
    "Verify location on map",
    "Ensure pricing is reasonable",
    "Review venue images and facilities",
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_320px]">
        
        {/* Quick Tips */}
        <div className="rounded-2xl bg-green-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Quick Tips
            </h3>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            Approve venues that meet our guidelines to make them visible
            for users. Only approve venues that contain complete and
            accurate information.
          </p>
        </div>

        {/* Approval Guidelines */}
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            Approval Guidelines
          </h3>

          <div className="space-y-4">
            {guidelines.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <span className="text-sm text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Overview */}
        <div className="rounded-2xl bg-slate-50 p-6">
          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            Today's Overview
          </h3>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                New Venues Submitted
              </span>

              <span className="font-semibold text-blue-600">
                3
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Venues Approved
              </span>

              <span className="font-semibold text-green-600">
                2
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Venues Rejected
              </span>

              <span className="font-semibold text-red-600">
                0
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}