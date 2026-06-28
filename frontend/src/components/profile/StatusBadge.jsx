const StatusBadge = ({ icon: Icon, label, tone = "neutral" }) => {
  const toneStyles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    warning: "bg-amber-50 text-amber-700 ring-amber-100",
    danger: "bg-red-50 text-red-700 ring-red-100",
    neutral: "bg-gray-100 text-gray-600 ring-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
        toneStyles[tone] || toneStyles.neutral
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {label}
    </span>
  );
};

export default StatusBadge;
