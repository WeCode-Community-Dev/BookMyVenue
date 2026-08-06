import { statusStyle } from "../../utils/ownerPageUtils";

export function BookingHistory({ history }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
      </div>
      <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
        {history.map((h) => (
          <div key={h.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{h.venue}</p>
              <p className="text-xs text-gray-400">{h.customer} · {h.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle(h.status)}`}>
                {h.status}
              </span>
              <span className="w-20 text-right text-sm font-semibold text-gray-900">
                ₹{h.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}