export default function DashboardStatCard({
  icon: Icon,
  title,
  value,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div
          className={`rounded-lg p-2 ${iconBg} ${iconColor}`}
        >
          <Icon size={18} />
        </div>

        <span className="text-sm font-medium text-gray-600">
          {title}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}