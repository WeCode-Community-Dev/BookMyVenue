const STATUS_STYLES = {
  pending_payment: "bg-amber-50 text-amber-700 border-amber-200",
  booked: "bg-emerald-50 text-emerald-700 border-emerald-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS = {
  pending_payment: "Pending payment",
  booked: "Confirmed",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  pending: "Pending",
  completed: "Completed",
  rejected: "Rejected",
};

function formatStatus(status) {
  if (!status) return "Unknown";
  return STATUS_LABELS[status] || status.replace(/_/g, " ");
}

function StatusBadge({ status, className = "" }) {
  const cls = STATUS_STYLES[status] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls} ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
}

export default StatusBadge;
