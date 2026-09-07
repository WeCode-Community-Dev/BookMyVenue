import {
  CalendarDays,
  Users,
  IndianRupee,
  Clock3,
} from "lucide-react";

export default function TodayAtGlanceCard() {
  return (
    <div className=" mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-xl font-semibold text-slate-900">
        Today at a Glance
      </h3>

      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-sky-50 p-2">
            <CalendarDays className="h-5 w-5 text-sky-600" />
          </div>

          <div>
            <p className="text-2xl font-semibold text-slate-900">
              2
            </p>
            <p className="text-sm text-slate-500">
              Bookings Today
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-teal-50 p-2">
            <Users className="h-5 w-5 text-teal-600" />
          </div>

          <div>
            <p className="text-2xl font-semibold text-slate-900">
              250
            </p>
            <p className="text-sm text-slate-500">
              Total Guests
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-green-50 p-2">
            <IndianRupee className="h-5 w-5 text-green-600" />
          </div>

          <div>
            <p className="text-2xl font-semibold text-slate-900">
              ₹27,600
            </p>
            <p className="text-sm text-slate-500">
              Today's Revenue
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-orange-50 p-2">
            <Clock3 className="h-5 w-5 text-orange-600" />
          </div>

          <div>
            <p className="text-2xl font-semibold text-slate-900">
              3
            </p>
            <p className="text-sm text-slate-500">
              Pending Requests
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}